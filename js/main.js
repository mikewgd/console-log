// Part of console.js, not a standalone module: scripts/build.js concatenates
// helpers.js, cl.js and main.js (in that order) inside one IIFE, so they share scope.
// This part runs at load time, so it must stay last.

// If the console is undefined or you are using a device.
// User agent detection: Android, webOS, iPhone, iPad, iPod, Blackberry, IEMobile and Opera Mini
if (typeof console !== 'object' || Helpers.isMobile() || console === undefined || CL.override()) {
  var timers = Object.create(null); // console.time labels -> start timestamps (ms)
  var sym = '';
  var entryClass = 'CL-entry';
  var output = '';
  var strObj = '';
  var space = ' ';
  var isError = false;            // Log is an error.
  var isExec = false;             // Executing code.
  var consoleError = false;       // Flag if using console.error
  var consoleAssert = false;
  var count = (function() {
    var counter = {};
    return function(v) {
      return (counter[v] = (counter[v] || 0) + 1);
    };
  }());

  CL.init();

  window.onerror = function(err, url, line) {
    isError = true;

    if (!isExec) {
      entryClass += ' CL-err';

      var li = Helpers.create('li', {
        'class': entryClass,
        html: sym + '<span class="CL-timest">' + new Date().toISOString().replace(/z|t/gi, ' ') + '</span> ' +
          '<span class="CL-entrytxt"><span style="color: ' + CL.synColor.err + '">' + err + '\n' + url + '\n on line: ' + line + '</span></span>'
      });

      CL._entries.insertBefore(li, CL._liExec);
      CL.newLog();
    } else {
      console.log(CL.textareaVal);
    }
  };

  window.console = {
    ID: '%CL%ML101417',
    log: function() {
      var li = null;
      var param = null;
      var pString = '%CL%ML101417';

      // isError = isError ? true : false;
      output = ''; // used to clear the output each time

      if (consoleAssert) {
        output = 'Assertion failed: ';
      }

      if (isExec) space = '<br>';

      try {
        // Loop through arguments passed in.
        for (var i = 0, ii = arguments.length; i < ii; i++) {
          param = arguments[i];

          if (isExec && isError && !consoleError) {
            entryClass = 'CL-entry';

            li = Helpers.create('li', {
              'class': entryClass,
              'html': sym + '<span class="CL-entrytxt">' + param + '</span>'
            });

            CL._entries.appendChild(li);
            // Intentional: this console executes code typed into its input box.
            eval(param); // jshint ignore:line
          }

          // If the parameter is an object special functionality needs to happen.
          if ((typeof param).toLowerCase() == 'object') {
            pString = param.toString();
            entryClass = 'CL-entry';

            if (pString == '[object Object]') {
              strObj = Helpers.ObjString(param);

              if (/\%CL\%ML101417/g.test(strObj)) {
                strObj = Helpers.ObjString(CL.funcs);
              }

              output += 'Object ' + CL.syntax('object', strObj) + space;
            } else if (pString.match(/^\[object */i)) {
              if (pString.match(/^\[object HTML*/i) || Helpers.isHtmlEl(param)) { // if param is HTML element
                output += CL.syntax('html', CL.printHTML(param)) + space;
              } else { // Most likely window, document etc...
                entryClass += ' CL-err';
                isError = true;
                output += '<span style="color: ' + CL.synColor.err + '">ERROR: Maximum call stack size exceeded.<br><em>Object is too deeply nested.</em></span>' + space;
              }
            } else { // Most likely an array.
              if (param.length > 1) {
                output += '[' + param + ']';
              }
            }
          } else {
            // entryClass = 'CL-entry';

            if (/\%CL\%ML101417/g.test(param)) {
              param = Helpers.ObjString(CL.funcs.log);
            }

            output += CL.syntax(typeof param, param) + space;
          }
        }
      } catch (e) {
        // To account for js keywords
        if ((typeof param).toLowerCase() == 'object') {
          output += CL.syntax(typeof param, param) + space;
        } else {
          entryClass += ' CL-err';
          output += '<span style="color: ' + CL.synColor.err + '">' + e + '</span>' + space;
        }
      }

      if (isError) {
        entryClass = 'CL-entry CL-err';
        sym = '<span class="CL-sym">x</span>';
      }

      if (output !== '') {
        li = Helpers.create('li', {
          'class': entryClass,
          'html': sym + '<span class="CL-entrytxt CL-timest">' + new Date().toISOString().replace(/z|t/gi, ' ') + '</span> ' +
            '<span class="CL-entrytxt">' + output.replace(/(<br\s*\/?>){3,}/gi, '<br>') + '</span>'
        });

        CL._entries.appendChild(li);
        CL.newLog();
      }        
    },

    clear: function() {
      var logs = CL._entries.getElementsByTagName('li');
      var logsCount = logs.length;
      var ID = '%CL%ML101417';

      entryClass += ' CL-cleared';

      if (logsCount !== 1) {
        while (logsCount--) {
          if (logs[logsCount].id !== 'CLExecute') {
            logs[logsCount].parentNode.removeChild(logs[logsCount]);
          }
        }
      }

      console.log('<em>Console was cleared</em>');
    },

    error: function() {
      var args = arguments;
      var ID = '%CL%ML101417';

      entryClass = 'CL-entry CL-err';
      isError = true;
      consoleError = true;

      console.log(args[0] === undefined ? '' : args[0], args[1] === undefined ? '' : args[1],
        args[2] === undefined ? '' : args[2], args[3] === undefined ? '' : args[3], 
        args[4] === undefined ? '' : args[4], args[5] === undefined ? '' : args[5], 
        args[6] === undefined ? '' : args[6], args[7] === undefined ? '' : args[7], 
        args[8] === undefined ? '' : args[8], args[9] === undefined ? '' : args[9], 
        args[10] === undefined ? '' : args[10]);
    },

    warn: function() {
      var args = arguments;
      var ID = '%CL%ML101417';

      entryClass = 'CL-entry CL-warn';
      // isError = isError ? true : false;

      console.log(args[0] === undefined ? '' : args[0],
        args[1] === undefined ? '' : args[1], args[2] === undefined ? '' : args[2],
        args[3] === undefined ? '' : args[3], args[4] === undefined ? '' : args[4],
        args[5] === undefined ? '' : args[5], args[6] === undefined ? '' : args[6],
        args[7] === undefined ? '' : args[7], args[8] === undefined ? '' : args[8],
        args[9] === undefined ? '' : args[9], args[10] === undefined ? '' : args[10]);
    },

    assert: function() {
      var args = [];
      var output = '';
      var ID = '%CL%ML101417';

      isError = consoleError = consoleAssert = true;

      for (var i = 0, ii = arguments.length; i < ii; i++) {
        args.push(arguments[i]);
      }

      args.shift();

      if (typeof arguments[0] === 'boolean') {
        if (!arguments[0]) {
          console.error(args[0] === undefined ? 'console.assert' : args[0],
            args[1] === undefined ? '' : args[1], args[2] === undefined ? '' : args[2],
            args[3] === undefined ? '' : args[3], args[4] === undefined ? '' : args[4],
            args[5] === undefined ? '' : args[5], args[6] === undefined ? '' : args[6],
            args[7] === undefined ? '' : args[7], args[8] === undefined ? '' : args[8],
            args[9] === undefined ? '' : args[9], args[10] === undefined ? '' : args[10]);
        } else {
          consoleAssert = consoleError = isError = false;
        }
      } else {
        consoleAssert = consoleError = isError = false;
        return;
      }
    },

    time: function() {
      var ID = '%CL%ML101417';
      var label = arguments[0] === undefined ? 'default' : String(arguments[0]);

      entryClass = 'CL-entry';
      // isError = isError ? true : false;
      timers[label] = Date.now();
    },

    timeEnd: function() {
      var li = '%CL%ML101417';
      var label = arguments[0] === undefined ? 'default' : String(arguments[0]);
      var elapsed;

      if (!(label in timers)) {
        console.warn("Timer '" + label + "' does not exist");
        return;
      }

      elapsed = Date.now() - timers[label];
      delete timers[label];
      // isError = isError ? true : false;
      entryClass = 'CL-entry';

      li = Helpers.create('li', {
        'class': entryClass,
        'html': sym + '<span class="CL-entrytxt CL-timest">' + new Date().toISOString().replace(/z|t/gi, ' ') + '</span> ' +
          '<span class="CL-entrytxt"><span style="color: ' + CL.synColor.time + '">' + label + ': ' + elapsed + 'ms</span></span>'
      });

      CL._entries.appendChild(li);
      CL.newLog();
    },

    count: function() {
      var ID = '%CL%ML101417';
      var countItem = (arguments[0] === '' || arguments[0] === undefined) ? '' : arguments[0] + ': ';
      console.log(countItem + count(arguments[0]).toString());
    }
  };
}
