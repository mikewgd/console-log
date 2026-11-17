// Part of console.js, not a standalone module: scripts/build.js concatenates
// helpers.js, cl.js and main.js (in that order) inside one IIFE, so they share scope.

/**
* @namespace CL
* Functionality used for the custom console.
*
*/
var CL = {
  show: true,
  height: 0,
  synColor: {
    err: '#FF0000',
    _null: '#808080',
    obj: '#881391',
    str: '#C41A16',
    numBoo: '#1C00CF',
    tag: '#881280',
    tagAttr: '#994500',
    tagVal: '#1A1AA6',
    time: '#0080FF'
  },
  textareaVal: '',
  funcs: {
    log: function() {'[native code]';},
    debug: function() {'[native code]';},
    time: function() {'[native code]';},
    timeEnd: function() {'[native code]';},
    clear: function() {'[native code]';},
    error: function() {'[native code]';},
    warn: function() {'[native code]';},
    assert: function() {'[native code]';},
    count: function() {'[native code]';}
  },

  _el: null,
  _liExec: null,
  _entries: null,

  /**
   * Initializes the custom console functions.
   */
  init: function() {
    this.setup();
    this.insertRules(document.styleSheets[document.styleSheets.length - 1], '{{consoleLogStyles}}'); // Replaced by scripts/build.js
    this.scriptParams();

    this.setHeight(this.height, true);
    this.toggle();
    this.bindEvents();
  },

  /**
   * Creates the console markup and appends to the document.
   */
  setup: function() {
    var style = Helpers.create('style', {
      'type': 'text/css'
    });

    this._entries = Helpers.create('ul', {
      'class': 'CL-entries'
    });

    this._el = Helpers.create('div', {
      'class': 'CL',
      id: 'customconsole',
      'html':
        '<div class="CL-header">' +
          '<a href="#" class="CL-tog" id="CLTog">' +
            '<h6 class="CL-title">Console</h6>' +
            '<span id="CLTogText" class="CL-togtxt">Click to hide</span>' +
          '</a>' +
        '</div>' +
        '<div class="CL-menu" id="CLMenu">' +
          '<a class="CL-clear" id="CLClear" href="#">CLEAR</a>' +
          '<span class="CL-label">Height:</span>' +
          '<input id="CLHeight" type="text" maxlength="3" class="CL-inp" />' +
          '<label class="CL-label" for="CLTime" id="fffff">Timestamp:</label>' +
          '<input id="CLTime" type="checkbox" value="show" class="CL-rad" />' +
        '</div>'
    });

    this._liExec = Helpers.create('li', {
      'class': 'CL-entry CL-exec',
      id: 'CLExecute',
      'html':
        '<span class="CL-sym">&gt;</span>' +
          '<span class="CL-entrytxt">' +
          '<textarea id="CLTextarea" class="CL-txtarea"></textarea>' +
          '<a class="CL-execbtn" id="CLExeBtn" href="#">Execute</a>' +
        '</span>'
    });

    document.getElementsByTagName('head')[0].appendChild(style);
    this._el.appendChild(this._entries);
    this._entries.appendChild(this._liExec);
    document.body.appendChild(this._el);
  },

  override: function() {
    var result = false;
    var scriptTags = document.getElementsByTagName('script');
    var scTagSrc = '';
    var queries = '';

    // Loop through script tags on page.
    for (var i = 0, ii = scriptTags.length; i < ii; i++) {
      scTagSrc = scriptTags[i].src;

      // Grab all script tags, if its console or console.min then check for param
      if (/.*console(\.min)?\.js/gi.test(scTagSrc) && scTagSrc.indexOf('?') > 0) {
        queries = scTagSrc.substring(scTagSrc.indexOf('?') + 1, scTagSrc.length).split('&');

        // Implement queries
        for (var j = 0, jj = queries.length; j < jj; j++) {
          if (queries[j] === 'override') {
            result = true;
            break;
          }
        }
      }
    }

    return result;
  },

  /**
   * Changes the default settings via query parameter in the script tag.
   */
  scriptParams: function() {
    var scriptTags = document.getElementsByTagName('script');
    var scTagSrc = '';
    var queries = '';
    var query = '';
    var self = this;

    // Loop through script tags on page.
    for (var i = 0, ii = scriptTags.length; i < ii; i++) {
      scTagSrc = scriptTags[i].src;

      // Grab all script tags, if its console or console.min then check for param
      if (/.*console(\.min)?\.js/gi.test(scTagSrc) && scTagSrc.indexOf('?') > 0) {
        queries = scTagSrc.substring(scTagSrc.indexOf('?') + 1, scTagSrc.length).split('&');

        // Implement queries
        for (var j = 0, jj = queries.length; j < jj; j++) {
          query = queries[j];

          if (Number(query)) {
            self.height = query;
          } else if (query === 'hide') {
            self.show = false;
          } else if (query === 'timestamp') {
            Helpers.$('CLTime').setAttribute('checked', true);
            Helpers.addClass(self._entries, 'show-timestamps');
          }
        }
      }
    }
  },

  /**
   * Events bound to elements in the custom console.
   */
  bindEvents: function() {
    var self = this;
    var textarea = Helpers.$('CLTextarea');


    Helpers.$('CLTog').onclick = function() {
      self.show = self.show ? false : true;
      self.toggle();
      return false;
    };

    Helpers.$('CLHeight').onkeyup = function(e) {
      self.setHeight(this.value, false);
    };

    Helpers.$('CLClear').onclick = function() {
      var logs = self._entries.getElementsByTagName('li');
      var logsCount = logs.length;

      if (logsCount !== 1) {
        while (logsCount--) {
          if (logs[logsCount].id !== 'CLExecute') {
            logs[logsCount].parentNode.removeChild(logs[logsCount]);
          }
        }
      }

      return false;
    };

    Helpers.$('CLTime').onchange = function() {
      if (this.checked) {
        Helpers.addClass(self._entries, 'show-timestamps');
      } else {
        Helpers.removeClass(self._entries, 'show-timestamps');
      }
    };

    Helpers.$('CLExeBtn').onclick = function() {
      if (textarea.value !== '') {
        isExec = true;
        self.textareaVal = textarea.value;
        self.executeCode(self.textareaVal);
        isExec = false;
      }

      return false;
    };
  },

  /**
   * WHen executing code from the textarea.
   *
   * @param {string} val The textarea value.
   */
  executeCode: function(val) {
    // eval is intentional here: this runs the code typed into the console's input box.
    /* jshint evil: true */
    var reg = /console\.*?.*/g;
    var reg2 = /console.*?\((.*)\)/;

    if ((val).match(reg)) {
      if (val.match(reg2)) {
        sym = '<span class="CL-sym">&gt;</span>';
        console.log(val);
        sym = '<span class="CL-sym Cl-sym2">&lt;</span>';
        console.log(eval(val));
      } else {
        if (val === 'console') {
          sym = '<span class="CL-sym">&gt;</span>';
          console.log(val);
          sym = '<span class="CL-sym Cl-sym2">&lt;</span>';
          console.log(this.funcs);
        } else {
          for (var key in this.funcs) {
            if (val === 'console.' + key) {
              sym = '<span class="CL-sym">&gt;</span>';
              console.log(val);
              sym = '<span class="CL-sym Cl-sym2">&lt;</span>';
              console.log(this.funcs[key]);
            }
          }
        }
      }
    } else {
      sym = '<span class="CL-sym">&gt;</span>';
      console.log(val);
      sym = '<span class="CL-sym Cl-sym2">&lt;</span>';
      console.log(eval(val));
    }
  },

  /**
   * Handles the toggling (hiding/showing) of the custom console.
   */
  toggle: function() {
    var toggleTxt = (this.show) ? 'hide' : 'show';
    var toggleElem = Helpers.$('CLTogText');

    toggleElem.innerHTML = 'Click to ' + toggleTxt;

    this._entries.style.display = (this.show) ? 'block' : 'none';
    Helpers.$('CLMenu').style.display = (this.show) ? 'block' : 'none';

    if (this.show) this.scrl2Btm();
  },

  /**
   * Sets the height of the console entries.
   *
   * @param {string} h The new height for the entries.
   * @param {boolean} init Used to determine if height is being set in initialization or via input field.
   */
  setHeight: function(h, init) {
    var val = Number(h);

    if (val >= 90 && val <= (Helpers.getWinH() - 150)) {
      this.height = val;
    } else {
      this.height = Helpers.getWinH() / 3;
    }

    if (init) {
      Helpers.$('CLHeight').value = this.height;
    }

    this._entries.style.height = this.height + 'px';
    this.scrl2Btm();
  },

  /**
   * Functionality that occurs when a new entry is added to the console.
   */
  newLog: function() {
    var textarea = Helpers.$('CLTextarea');
    this._entries.appendChild(this._liExec);
    textarea.value = '';
    textarea.focus();
    this.scrl2Btm();
    isExec = isError = consoleError = consoleAssert = false;
    entryClass = 'CL-entry';
    sym = '';
  },

  /**
   * Ensures the entries list is always scrolled to the bottom.
   */
  scrl2Btm: function() {
    this._entries.scrollTop = this._entries.scrollHeight;
  },

  /**
  * Returns string with HTML surrounding, used for coloring.
  *
  * @param {String} type Type of argument being passed, i.e. number, null, etc..
  * @param {String} str String being passed to surround with.
  * @return {String}
  */
  syntax: function(type, str) {
    var formattedString = str;
    var self = this;

    if (type == 'object') {
      if (str === null) {
        formattedString = '<span style="color: ' + this.synColor._null + '">' + str + '</span>';
      } else {
        formattedString = str.replace(new RegExp(/(\w+)(\:)/g), '<span style="color: ' + this.synColor.obj + '">$1</span>$2') // key in object
        .replace(new RegExp(/(&nbsp;)(-?\d+\D?\d+)|(&nbsp;)(-?\d)|(&nbsp;)(true|false)/g), '$1$3$5<span style="color: ' + this.synColor.numBoo + '">$2$4$6</span>') //number or boolean value
        .replace(new RegExp(/(&nbsp;)(".*?")/g), '$1<span style="color: ' + this.synColor.str + '">$2</span>'); // string value
      }
    } else if (type == 'html') {
      var formattedString2 = str.replace(new RegExp(/&lt;(.*?)&gt;/gi), function(x) { // HTML tags
        return '<span style="color: ' + self.synColor.tag + '">' + x + '</span>';
      });

      formattedString = formattedString2.replace(new RegExp(/&lt;(?!\/)(.*?)&gt;/gi), function(y) { // HTML tag attributes 
        var attr = new RegExp(/ (.*?)="(.*?)"/gi);
        return y.replace(attr, ' <span style="color: ' + self.synColor.tagAttr + '">$1</span>="<span style="color: ' + self.synColor.tagVal + '">$2</span>"');
      });
    } else if (type == 'number' || type == 'boolean') {
      formattedString = '<span style="color: ' + this.synColor.numBoo + '">' + str + '</span>';
    } else if (type === 'undefined') {
      formattedString = '<span style="color: ' + this.synColor._null + '">' + str + '</span>';
    }

    return formattedString;
  },

  /**
  * Returns HTML as a string.
  *
  * @param {HTMLElement/Object} el The element to be parsed.
  * @return {String}
  */
  printHTML: function(el) {
    var outputDiv = Helpers.create('div');
    var elem = null;
    var html = '';
    var breakLine = null;

    // Clear each time called.
    outputDiv.innerHTML = '';

    try {
      elem = el.cloneNode(true); // Needed to use clone because it was removing orginal elements
      outputDiv.appendChild(elem);
    } catch (e) {
      for (var i = 0, ii = el.length; i < ii; i++) {
        breakLine = document.createTextNode('\n');
        elem = el[i].cloneNode(true);

        outputDiv.appendChild(elem);
        outputDiv.appendChild(breakLine);
      }
    }

    // Replace entities
    html = outputDiv.innerHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return html.replace(/\n/g, '<br>'); // Add breaking space
  },

  /**
  * Adds CSS rules into a <style> tag.
  *
  * @param {HTMLElement} sheet The <style> element you want to add rules/css into.
  * @param {String} minifiedCSSFile Contents of an entire CSS file, minified.
  */
  insertRules: function(sheet, minifiedCSSFile) {
    var selectors = [];
    var selector = null;
    var rules = [];
    var rule = null;
    var cssSplit = minifiedCSSFile.split('}');
    var sp = [];

    for (var i = 0, ii = cssSplit.length; i < ii; i++) {
      sp = cssSplit[i].split('{');

      if (sp[0] !== '') selectors.push(sp[0]);
      if (sp[1] !== undefined) rules.push(sp[1]);
    }

    for (var j = 0, jj = selectors.length; j < jj; j++) {
      selector = selectors[j];
      rule = rules[j];

      sheet.insertRule(selector + '{' + rule + '}', 0);
    }
  }
};
