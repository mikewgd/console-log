(function() {
  /**
  * @namespace CLHelpers
  * Helper/Utility functions.
  */
  var CLHelpers = {
    /**
    * Returns an element to be created in the DOM and adds attributes.
    *
    * @param {string} tag Tag you want to created, i.e "div", "span", etc...
    * @param {object} attrs Attributes you want on the tag, i.e. class="test", src="img.jpg", etc...
    * @return {HTMLElement}
    */
    create: function(element, attrs) {
      var elem = document.createElement(element);

      if (attrs) {
        for (var attr in attrs) {
          if (attr === 'html') {
            elem.innerHTML = attrs[attr];
          } else {
            // IE does not support support setting class name with set attribute
            ([attr] == 'class') ? elem.className = attrs[attr] : elem.setAttribute([attr], attrs[attr]);
          }
        }
      }

      return elem;
    },

    /**
    * Returns true or false if we are viewing on a mobile or tablet device.
    * @return {Boolean}
    */
    isMobile: function() {
      var devices = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      return (devices.test(navigator.userAgent)) ? true : false;
    },

    /**
    * Returns an element based on id.
    *
    * @param {String} id The id of the element to return.
    * @return {htmlelement}
    */
    eleById: function(id) {
      return document.getElementById(id);
    },

    /**
     * Returns true/false if a node is an HTML tag.
     *
     * @param {object} p The node to test if it is an HTML tag.
     * @return {Boolean}
     */
    isHtmlElem: function(p) {
      return ((p.length) ? p[0].nodeType : p.nodeType === 1) ? true : false;
    },

    /**
    * Returns true or false if the browser is IE8 or IE9
    * @credit http://blogs.msdn.com/b/giorgio/archive/2009/04/14/how-to-detect-ie8-using-javascript-client-side.aspx
    * @return {Boolean}
    */
    isIE8or9: function() {
      var rv = -1; // Return value assumes failure.
      if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})');

        if (re.exec(ua) !== null) rv = parseFloat(RegExp.$1);
      }

      return (rv === 8 || rv === 9) ? true : false;
    },

    /**
    * Returns the viewport height of the browser window.
    * @return {Number}
    */
    getWindowHeight: function() {
      var winHeight = 0;
      var win = window;
      var doc = document;
      var docEle = doc.documentElement;

      if (typeof win.innerHeight != 'undefined') {
        winHeight = window.innerHeight;
      } else if (typeof docEle != 'undefined' && typeof docEle.clientHeight != 'undefined' && docEle.clientHeight !== 0) {
        winHeight = docEle.clientHeight;
      } else {
        winHeight = doc.getElementsByTagName('body')[0].clientHeight;
      }

      return winHeight;
    },

    /**
    * Returns an Object as a string
    * Credits go to https://github.com/douglascrockford/JSON-js
    * Code was modified to fit certain needs.
    *
    * @param {Object} obj Object being passed
    * @return {String}
    */
    ObjToString: function(obj) {
      var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
      var gap = '';
      var indent = '';
      var meta = {
        "\b": "\\b",
        "  ": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
      };

      // Returns the primitive value
      String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
        return this.valueOf();
      };

      /**
      * Returns string with quotes
      *
      * @param {String} string - string being passed to surround with quotes.
      * @return {String}
      */
      var quote = function(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
          var c = meta[a];
          return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
      };

      // Responsible for indentation, set to 4 spaces
      for (var i = 0; i < 2; i += 1) {
        indent += ' ';
      }

      // Magic behind parsing objects
      var str = function(key, holder) {
        var i = 0; // The loop counter.
        var k = null; // The member key.
        var v = null; // The member value.
        var length;
        var mind = gap;
        var partial; 
        var value = holder[key];

        if (value && typeof value === 'object' &&
          typeof value.toJSON === 'function') {
          value = value.toJSON(key);
        }

        switch (typeof value) {
          case 'string':
            return quote(value);
          case 'number':
            return isFinite(value) ? String(value) : 'null';
          case 'boolean':
          case 'null':
          case 'function':
            return String(value);
          case 'object':
            if (!value) {
              return 'null';
            }

            gap += indent;
            partial = [];

            if (Object.prototype.toString.apply(value) === '[object Array]') {
              length = value.length;

              for (i = 0; i < length; i += 1) {
                partial[i] = str(i, value) || 'null';
              }

              v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
              gap = mind;
              return v;
            }

            for (k in value) {
              if (Object.prototype.hasOwnProperty.call(value, k)) {
                v = str(k, value);
                if (v) {
                  /* Removing quotes from key
                  partial.push(quote(k) + (gap ? ': ' : ':') + v);*/
                  partial.push(k + (gap ? ': ' : ':') + v);
                }
              }
            }

            v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
      };

      var j = str('', {
        '': obj
      });

      return j.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
    }
  };

  /**
  * @namespace CL
  * Functionality used for the custom console.
  *
  * @property {boolean} show Console visibility.
  * @property {int} height Height of the console.
  * @property {object} syntaxColor Color mapping for syntax highlighting.
  * @property {HTMLDivElement} _console The main div for the console, .console-log
  * @property {HTMLLiElement} _liExecute The last LI element, execute code.
  * @property {HTMLUlElement} _entries The UL element that holds all LIs
  */
  var CL = {
    show: true,
    height: 0,
    syntaxColor: {
      error: '#FF0000',
      _null: '#808080',
      objkey: '#881391',
      str: '#C41A16',
      numberBoolean: '#1C00CF',
      htmlTag: '#881280',
      htmlTagAttr: '#994500',
      htmlTagVal: '#1A1AA6',
      time: '#0080FF',
      execute: '#0080FF'
    },

    _console: null,
    _liExecute: null,
    _entries: null,

    /**
     * Initializes the custom console functions.
     */
    init: function() {
      this.addMarkup();
      this.insertRules(document.styleSheets[document.styleSheets.length - 1], '{{consoleLogStyles}}'); // Replaced by gulp
      this.scriptParams();

      // Added because IE 8 & 9 does support console.log, just needs to be enabled.
      if (CLHelpers.isIE8or9()) {
        alert('IE 8 & 9 support the console. The developer tools need to be opened for the console to work.')
      }
      
      this.setHeight(this.height, true);
      this.toggle();
       
      this.bindEvents();
    },

    /**
     * Creates the console markup and appends to the document.
     */
    addMarkup: function() {
      var style = CLHelpers.create('style', {
        'type': 'text/css',
        'id': 'consoleLogStyle'
      });

      this._entries = CLHelpers.create('ul', {
        'class': 'console-log__entries'
      });

      this._console = CLHelpers.create('div', {
        'class': 'console-log',
        id: 'consolelog',
        'html':
          '<div class="console-log__header">' +
            '<a href="#" class="console-log__toggle" id="consoleToggle">' +
              '<h6 class="console-log__title">Console</h6>' +
              '<span id="consoleToggleText" class="console-log__toggle-text">Click to hide</span>' +
            '</a>' +
          '</div>' +
          '<div class="console-log__menu" id="consoleMenu">' +
            '<a class="console-log__clear" id="consoleClear" href="#">CLEAR</a>' +
            '<span class="console-log__menu-label">Height:</span>' +
            '<input id="consoleHeight" type="text" value="' + this.height + '" maxlength="3" class="console-log__height-input" />' +
          '</div>'
      });

      this._liExecute = CLHelpers.create('li', {
        'class': 'console-log__entry console-log__entry--execute',
        id: 'consoleLIExecute',
        'html':
          '<span class="console-log__entry-symbol">&gt;</span>' +
            '<span class="console-log__entry-text">' +
            '<textarea id="consoleTextarea" class="console-log__execute-textarea"></textarea>' +
            '<a class="console-log__execute-btn" id="consoleExecuteBtn" href="#">Execute</a>' +
          '</span>'
      });

      document.getElementsByTagName('head')[0].appendChild(style);
      this._console.appendChild(this._entries);
      this._entries.appendChild(this._liExecute);
      document.body.appendChild(this._console);
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
            result = (queries[j] === 'override') ? true : false;
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
            } else {
              self.show = (query == 'hide') ? false : true;
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

      CLHelpers.eleById('consoleToggle').onclick = function() {
        self.show = self.show ? false : true;  
        self.toggle();
        return false;
      };

      CLHelpers.eleById('consoleHeight').onkeyup = function(e) {
        self.setHeight(this.value, false);
      };

      CLHelpers.eleById('consoleClear').onclick = function() {
        var logs = self._entries.getElementsByTagName('li');
        var logsCount = logs.length;
 
        if (logsCount !== 1) {
          while (logsCount--) {
            if (logs[logsCount].id !== 'consoleLIExecute') {
              logs[logsCount].parentNode.removeChild(logs[logsCount]);
            }
          }
        }

        return false;
      };

      CLHelpers.eleById('consoleExecuteBtn').onclick = function() {
        if (CLHelpers.eleById('consoleTextarea').value !== '') {
          isExecute = true;
          console.log('<span style="color: ' + self.syntaxColor.execute + '">' + CLHelpers.eleById('consoleTextarea').value + '</span>', eval(CLHelpers.eleById('consoleTextarea').value));
          CL.scrollToBottom();
        }

        return false;
      };
    }, 

    /**
     * Handles the toggling (hiding/showing) of the custom console.
     */
    toggle: function() {
      var toggleTxt = (this.show) ? 'hide' : 'show';
      var toggleElem = CLHelpers.eleById('consoleToggleText');

      toggleElem.innerHTML = 'Click to ' + toggleTxt;

      this._entries.style.display = (this.show) ? 'block' : 'none';
      CLHelpers.eleById('consoleMenu').style.display = (this.show) ? 'block' : 'none';

      if (this.show) this.scrollToBottom();
    },

    /**
     * Sets the height of the console entries.
     *
     * @param {string} h The new height for the entries.
     * @param {boolean} init Used to determine if height is being set in initialization or via input field.
     */
    setHeight: function(h, init) {
      var val = Number(h);

      if (val >= 90 && val <= (CLHelpers.getWindowHeight() - 64) / 2) {
        this.height = val;
      } else {
        this.height = CLHelpers.getWindowHeight() / 3;
      }

      if (init) {
        CLHelpers.eleById('consoleHeight').value = this.height;
      }

      this._entries.style.height = this.height + 'px';
      this.scrollToBottom();
    },

    /**
     * Functionality that occurs when a new entry is added to the console.
     */
    newLog: function() {
      this._entries.appendChild(this._liExecute);
      CLHelpers.eleById('consoleTextarea').value = '';
      CLHelpers.eleById('consoleTextarea').focus();
      this.scrollToBottom();
      isExecute = false; // Reset variable & textarea value
    },

    /**
     * Ensures the entries list is always scrolled to the bottom.
     */
    scrollToBottom: function() {
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
          formattedString = '<span style="color: ' + this.syntaxColor._null + '">' + str + '</span>';
        } else {
          formattedString = str.replace(new RegExp(/(\w+)(\:)/g), '<span style="color: ' + this.syntaxColor.objkey + '">$1</span>$2') // key in object
          .replace(new RegExp(/(&nbsp;)(-?\d+\D?\d+)|(&nbsp;)(-?\d)|(&nbsp;)(true|false)/g), '$1$3$5<span style="color: ' + this.syntaxColor.numberBoolean + '">$2$4$6</span>') //number or boolean value
          .replace(new RegExp(/(&nbsp;)(".*?")/g), '$1<span style="color: ' + this.syntaxColor.str + '">$2</span>'); // string value
        }
      } else if (type == 'html') {
        var formattedString2 = str.replace(new RegExp(/&lt;(.*?)&gt;/gi), function(x) { // HTML tags
          return '<span style="color: ' + self.syntaxColor.htmlTag + '">' + x + '</span>';
        });

        formattedString = formattedString2.replace(new RegExp(/&lt;(?!\/)(.*?)&gt;/gi), function(y) { // HTML tag attributes 
          var attr = new RegExp(/ (.*?)="(.*?)"/gi);
          return y.replace(attr, ' <span style="color: ' + self.syntaxColor.htmlTagAttr + '">$1</span>="<span style="color: ' + self.syntaxColor.htmlTagVal + '">$2</span>"');
        });
      } else if (type == 'number' || type == 'boolean') {
        formattedString = '<span style="color: ' + this.syntaxColor.numberBoolean + '">' + str + '</span>';
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
      var outputDiv = CLHelpers.create('div');
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

      // Added in for IE
      html = html.replace(/&lt;\/?([A-Z]+)/g, function(x) {
        return x.toLowerCase();
      })
      .replace(/([a-zA-Z]+)=([a-zA-Z]+-?[a-zA-Z]+)/g, '$1="$2"');

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

        if ('insertRule' in sheet) {
          sheet.insertRule(selector + '{' + rule + '}', 0);
        } else if ('addRule' in sheet) {
          sheet.addRule(selector, rule, 0);
        }
      }
    }
  };

  // If the console is undefined or you are using a device.
  // User agent detection: Android, webOS, iPhone, iPad, iPod, Blackberry, IEMobile and Opera Mini
  if (typeof console !== 'object' || CLHelpers.isMobile() || console === undefined || CL.override()) {
    var start = 0;
    var end = 0;
    var symbol = '<span class="console-log__entry-symbol">&gt;</span>';
    var output = '';
    var space = ' ';
    var isExecute = false;

    CL.init();

    window.onerror = function(err, url, line) {
      var li = CLHelpers.create('li', {
        html: symbol + '<span class="console-log__entry-text"><span style="color: ' + CL.syntaxColor.error + '">' + err + '\n' + url + '\n on line: ' + line + '</span></span>'
      });

      CL._entries.insertBefore(li, CL._liExecute);
      CL.scrollToBottom();
    };

    window.console = console = {
      log: function() {
        var li = null;
        var param = null;
        var pString = null;

        output = ''; // used to clear the output each time

        if (isExecute) space = '<br>';

        try {
          // Loop through arguments passed in.
          for (var i = 0, ii = arguments.length; i < ii; i++) {
            param = arguments[i];
            pString = param.toString();

            // If the parameter is an object special functionality needs to happen.
            if ((typeof param).toLowerCase() == 'object') {
              if (pString == '[object Object]') {
                output = 'Object ' + CL.syntax('object', CLHelpers.ObjToString(param)) + space;
              } else if (pString.match(/^\[object */i)) {
                if (pString.match(/^\[object HTML*/i) || CLHelpers.isHtmlElem(param)) { // if param is HTML element
                  output = CL.syntax('html', CL.printHTML(param)) + space;
                } else { // Most likely window, document etc...
                  output = '<span style="color: ' + CL.syntaxColor.error + '">ERROR: Maximum call stack size exceeded.<br><em>Object is too deeply nested.</em></span>' + space;
                }
              } else { // Most likely an array.
                if (param.length > 1) {
                  output = '[' + param + ']';
                }
              }
            } else {
              output += CL.syntax(typeof param, param) + space;
            }
          }
        } catch (e) {
          // To account for js keywords
          if ((typeof param).toLowerCase() == 'object') {
            output += CL.syntax(typeof param, param) + space;
          } else {
            output += '<span style="color: ' + CL.syntaxColor.error + '">' + e + '</span>' + space;
          }
        }

        li = CLHelpers.create('li', {
          'class': 'console-log__entry',
          'html': symbol + '<span class="console-log__entry-text">' + output + '</span>'
        });

        CL._entries.appendChild(li);
        CL.newLog();
      }, 

      time: function() {
        start = new Date().getMilliseconds();
      },

      timeEnd: function() {
        end = new Date().getMilliseconds();

        var li = CLHelpers.create('li', {
          'class': 'console-log__entry',
          'html': symbol + '<span class="console-log__entry-text"><span style="color: ' + CL.syntaxColor.time + '">' + arguments[0] + ': ' + Math.abs(start - end) + 'ms</span></span>'
        });

        CL._entries.appendChild(li);
        CL.newLog();
      }
    };
  }

})();
