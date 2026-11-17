// Part of console.js, not a standalone module: scripts/build.js concatenates
// helpers.js, cl.js and main.js (in that order) inside one IIFE, so they share scope.

/**
* @namespace Helpers
* Helper/Utility functions.
*/
var Helpers = {
  /**
  * Returns an element to be created in the DOM and adds attributes.
  *
  * @param {string} tag Tag you want to created, i.e "div", "span", etc...
  * @param {object} attrs Attributes you want on the tag, i.e. class="test", src="img.jpg", etc...
  * @return {HTMLElement}
  */
  create: function(element, attrs) {
    var ele = document.createElement(element);

    if (attrs) {
      for (var attr in attrs) {
        if (attr === 'html') {
          ele.innerHTML = attrs[attr];
        } else {
          ele.setAttribute(attr, attrs[attr]);
        }
      }
    }

    return ele;
  },

  /**
  * @function removeClass
  * Removes a class name from an element.
  * Thanks to http://blkcreative.com/words/simple-javascript-addclass-removeclass-and-hasclass/
  *
  * @param {HTMLElement} elem - element of class name you want removed.
  * @param {String} classN - class name to be removed.
  */
  removeClass: function(elem, classN) {
    var currClass = elem.className.replace(/(^\s+|\s+$)/g, '');
    var regex = new RegExp("(^|\\s)" + classN + "(\\s|$)", "g");

    elem.className = (currClass.replace(regex, " ")).replace(/(^\s+|\s+$)/g, '');
  },

  /**
  * @function hasClass
  * Returns true or false if an element has a specifc class name.
  * Thanks to http://blkcreative.com/words/simple-javascript-addclass-removeclass-and-hasclass/
  *
  * @param {HTMLElement} elem - element that may have the class name specified.
  * @param {String} classN - class name to be checked for.
  */
  hasClass: function(elem, classN) {
    var regex = new RegExp("(^|\\s)" + classN + "(\\s|$)");
    return regex.test(elem.className);
  },

  /**
  * @function addClass
  * Adds a class name to a given element.
  *
  * @param {HTMLElement} elem - element that you want a class name added to.
  * @param {String} classN - new class name you want added to element.
  */
  addClass: function(elem, classN) {
    var currClass = elem.className.replace(/(^\s+|\s+$)/g, '');
    var addedClass = (currClass.length === 0) ? classN : currClass + ' ' + classN;

    if (!this.hasClass(elem, classN)) elem.className = addedClass;
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
  $: function(id) {
    return document.getElementById(id);
  },

  /**
   * Returns true/false if a node is an HTML tag.
   *
   * @param {object} p The node to test if it is an HTML tag.
   * @return {Boolean}
   */
  isHtmlEl: function(p) {
    return ((p.length) ? p[0].nodeType : p.nodeType === 1) ? true : false;
  },

  /**
  * Returns the viewport height of the browser window.
  * @return {Number}
  */
  getWinH: function() {
    var winH = 0;
    var win = window;
    var doc = document;
    var docEle = doc.documentElement;

    if (typeof win.innerHeight != 'undefined') {
      winH = window.innerHeight;
    } else if (typeof docEle != 'undefined' && typeof docEle.clientHeight != 'undefined' && docEle.clientHeight !== 0) {
      winH = docEle.clientHeight;
    } else {
      winH = doc.getElementsByTagName('body')[0].clientHeight;
    }

    return winH;
  },

  /**
  * Returns an Object as a string
  * Credits go to https://github.com/douglascrockford/JSON-js
  * Code was modified to fit certain needs.
  *
  * @param {Object} obj Object being passed
  * @return {String}
  */
  ObjString: function(obj) {
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
      var tag;

      if (value && typeof value === 'object') {
        tag = Object.prototype.toString.call(value);

        if (tag === '[object String]' || tag === '[object Number]' || tag === '[object Boolean]') {
          // Unwrap boxed primitives (new String('x'), etc.) here instead of patching
          // toJSON onto the page's built-in prototypes.
          value = value.valueOf();
        } else if (typeof value.toJSON === 'function') {
          value = value.toJSON(key);
        }
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
