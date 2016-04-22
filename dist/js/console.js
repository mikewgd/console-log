 (function(){
	/**
	* Returns an element to be created in the DOM and adds attributes.
	* NOTE: It is best to put it in a variable.
	*
	* @param {String} tag Tag you want to created, i.e "div", "span", etc...
	* @param {Object} attrs Attributes you want on the tag, i.e. class="test", src="img.jpg", etc...
	* @return {HTMLElement}
	*/
	function CLcreate(element, attrs) {
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
	}

	/**
	* Returns true or false if we are viewing on a mobile or tablet device.
	*
	* @return {Boolean}
	*/
	function CLisMobile(){
		var devices = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
		return (devices.test(navigator.userAgent)) ? true : false;
	}

	/**
	* Returns an Object as a string
	* Credits go to https://github.com/douglascrockford/JSON-js
	* Code was modified to fit certain needs.
	*
	* @param {Object} obj - object being passed
	* @return {String}
	*/
	function ObjToString(obj) {
		var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, 
	        gap = '', indent = '', 
	        meta = {"\b":"\\b","  ":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};

	    // Returns the primitive value
	    String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
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
	        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
	            var c = meta[a];
	            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	        }) + '"' : '"' + string + '"';
	    };

	    // Responsible for indentation, set to 4 spaces
	    for (i = 0; i < 2; i += 1) {
	        indent += ' ';
	    }

	    // Magic behind parsing objects
	    var str = function(key, holder) {
	        var i,          // The loop counter.
	            k,          // The member key.
	            v,          // The member value.
	            length, mind = gap, partial, value = holder[key];

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
		                        /*
								Removing quotes from key
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

		var j = str('', {'': obj});
		return j.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
	}

	/**
	* Returns string with HTML surrounding, used for coloring.
	*
	* @param {String} type - type of argument being passed, i.e. number, null, etc..
	* @param {String} str - string being passed to surround with.
	* @return {String}
    */
	function syntaxHighlighting(type, str) {
		var formattedString = str;

		if (type == 'object') {
			if (str === null) {
				formattedString = '<span style="color:#808080;">'+str+'</span>';
			} else {
				formattedString = str.replace(new RegExp(/(\w+)(\:)/g), '<span style="color: #881391;">$1</span>$2') // key in object
					  .replace(new RegExp(/(&nbsp;)(-?\d+\D?\d+)|(&nbsp;)(-?\d)|(&nbsp;)(true|false)/g), '$1$3$5<span style="color: #1C00CF;">$2$4$6</span>') //number or boolean value
					  .replace(new RegExp(/(&nbsp;)(".*?")/g), '$1<span style="color: #C41A16;">$2</span>'); // string value
			}
		} else if (type == 'html') {
			var formattedString2 = str.replace(new RegExp(/&lt;(.*?)&gt;/gi), function(x) { // HTML tags
		        return '<span style="color: #881280;">'+x+'</span>';
		    });
		    
		    formattedString = formattedString2.replace(new RegExp(/&lt;(?!\/)(.*?)&gt;/gi), function(y) { // HTML tag attributes 
		        var attr = new RegExp(/ (.*?)="(.*?)"/gi);        
		        return y.replace(attr, ' <span style="color: #994500;">$1</span>="<span style="color: #1A1AA6;">$2</span>"');
		    });
		} else if (type == 'number' || type == 'boolean') {
			formattedString = '<span style="color: #1C00CF;">'+str+'</span>';
		}

		return formattedString;
	}

	/**
	* Returns HTML as a string.
	*
	* @param {HTMLElement/Object} el - the element to be parsed.
	* @return {String}
	*/
	function printHTML(el) {
		var outputDiv = CLcreate('div'),
			elem, html;
			
		// Clear each time called.
		outputDiv.innerHTML = '';

		try {
			elem = el.cloneNode(true); // Needed to use clone because it was removing orginal elements
			outputDiv.appendChild(elem);
		} catch(e) {
			for (var i=0, ii=el.length; i<ii; i++) {
				var breakLine = document.createTextNode('\n');
				elem = el[i].cloneNode(true);

				outputDiv.appendChild(elem);
				outputDiv.appendChild(breakLine);
			}
		}

		// Replace entities
		html = outputDiv.innerHTML.replace(/</g,'&lt;').replace(/>/g,'&gt;');

		// Added in for IE
		html = html.replace(/&lt;\/?([A-Z]+)/g, function(x) {return x.toLowerCase();})
				   .replace(/([a-zA-Z]+)=([a-zA-Z]+-?[a-zA-Z]+)/g, '$1="$2"');

		return html.replace(/\n/g, '<br>'); // Add breaking space
	}

	/**
	* Adds CSS rules into a <style> tag.
	*
	* @param {HTMLElement} sheet - The <style> element you want to add rules/css into.
	* @param {String} minifiedCSSFile - Contents of an entire CSS file, minified.
    */
	function insertRules(sheet, minifiedCSSFile) {
		var selectors = [], rules = [], cssSplit = minifiedCSSFile.split('}');
		for (var i=0; i<cssSplit.length; i++) {
			var sp = cssSplit[i].split('{');

			if (sp[0] !== '') selectors.push(sp[0]);
			if (sp[1] !== undefined) rules.push(sp[1]);			
		}

		for (var i=0; i<selectors.length; i++) {
			var selector = selectors[i], rule = rules[i];
			
			if ('insertRule' in sheet) {
				sheet.insertRule(selector + '{' + rule + '}', 0);
			} else if('addRule' in sheet) { // for browsers that do not suppoer insertRule
				sheet.addRule(selector, rule, 0);
			}
		}
	} 

	/**
	* Returns the viewport height of the browser window.
	*
	* @return {Number}
    */
	function getWindowHeight() {
		var winHeight, win = window, doc = document, 
			docEle = doc.documentElement, body = doc.getElementsByTagName('body')[0];

		if (typeof win.innerHeight != 'undefined') {
			winHeight = window.innerHeight;
		} else if (typeof docEle != 'undefined' && typeof docEle.clientHeight != 'undefined' && docEle.clientHeight != 0) {
			winHeight = docEle.clientHeight;
		} else {
			winHeight = body.clientHeight;
		}

		return winHeight;
	}

	/** 
	* @function isIE8or9
	* Returns true or false if the browser is IE8 or IE9
	* Credits go to http://blogs.msdn.com/b/giorgio/archive/2009/04/14/how-to-detect-ie8-using-javascript-client-side.aspx
	* @return {Boolean}
	*/
	function isIE8or9() {
		var rv = -1; // Return value assumes failure.
		if (navigator.appName == 'Microsoft Internet Explorer') {
			var ua = navigator.userAgent, 
				re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			
			if (re.exec(ua) != null) rv = parseFloat(RegExp.$1);
		}

		return (rv === 8 || rv === 9) ? true : false;
	}

	// If the console is undefined or you are using a device.
	// User agent detection: Android, webOS, iPhone, iPad, iPod, Blackberry, IEMobile and Opera Mini
	if (typeof console == undefined || CLisMobile() || typeof console == 'undefined') { 
		var scriptTags = document.getElementsByTagName('script'),
			consoleShown = true, output, space = ' ', 
			windowHeight = getWindowHeight(),
			height = Math.round(windowHeight/3), logHeight, start, end,
			isExecute = false, symbol = '<span class="console-log-logs-sym">&gt;</span>',
			consoleLog = CLcreate('div', {id: 'consoleLog', 'class': 'console-log'}),
			consoleLogMessage = CLcreate('div', {'class': 'consoleLogMessage', 'html': '<p><strong>HINT:</strong> Did you know your browser actually supports the <code>console</code> object?</p><p>All you need to do is open the <strong>Developer Tools</strong>. [<a href="http://stackoverflow.com/a/690300" target="_blank" class="referenceMsg">reference</a>]</p>'}),
			consoleLogMessageClose = CLcreate('a', {'class': 'closeConsoleMessage', 'href': '#', 'html': 'X'}),
			consoleLogStyle = CLcreate('style', {'type': 'text/css', 'id': 'consoleLogStyle'}),
			consoleLogBody = CLcreate('div', {id: 'consoleLogBody', 'class': 'console-log-body cl-scroll', 'style': 'overflow: auto;', 'html': document.body.innerHTML}),
			consoleLogHeader = CLcreate('div', {'class': 'console-log-header', 'html': '<h6>Console.Log</h6>'}),
			consoleLogToggle = CLcreate('a', {href: '#', 'class': 'console-log-toggle', 'html': '<span>Click to hide</span>'}),
			consoleLogLogs = CLcreate('div', {'class': 'console-log-logs'}),
			consoleLogLogsUl = CLcreate('ul'),
			consoleLogMenuBar = CLcreate('div', {'class': 'console-log-menu-bar', 'html': '<a href="#">CLEAR</a><span>Height:</span>'}),
			consoleLogLogsLiExecute = CLcreate('li', {'id': 'consoleLogLiExecute','class': 'console-log-execute', 'html': '<span class="console-log-logs-sym">&gt;</span><span class="console-log-logs-entry"></span>'}),
			consoleLogTextarea = CLcreate('textarea', {id: 'consoleLogExecuteTextArea', 'name': 'consoleLogExecuteTextArea'}),
			consoleLogExecuteBtn = CLcreate('a', {href: '#', 'html': 'Execute'}),
			consoleLogHeightInput = CLcreate('input', {id: 'consoleLogHeightInput', 'class': 'console-log-text-input', type: 'text', value: height, maxlength: 3});

		/**
		* Scrolls to the latest log.
	    */
		function consoleLogLatest() {
			consoleLogLogsUl.scrollTop = consoleLogLogsUl.scrollHeight;
		}

		/**
		* Hides and shows the console log and changes the toggle text.
	    */
		function consoleLogToggleFunc() {
			var toggleTxt = (consoleShown) ? 'hide' : 'show',
				toggleElem = consoleLogToggle.getElementsByTagName('span')[0];
    
			toggleElem.innerHTML = 'Click to '+toggleTxt;
			consoleLogLogs.style.display = (consoleShown) ? 'block' : 'none';

			if (consoleShown) consoleLogLatest();
			consoleLogViewHeightFunc(null);
		}

		/**
		* Changes the height of the logs <ul> element.
		*
		* @param {Number} h - the height to change for the <ul> element.
	    */
		function consoleLogHeightFunc(h) {
			var val = Number(h), winHeight = windowHeight;

			if (val >= 90 && val <= (winHeight-64)/2) {
				logHeight = val;
			} else {
				logHeight = winHeight/3;
			}

			consoleLogLogsUl.style.height = logHeight+'px';
			consoleLogViewHeightFunc(logHeight)
		}

		/**
		* Changes the height of the body frame.
		*
		* @param {Number} h (optional) - the height of the <ul> element. if not passed will grab the variable.
	    */
		function consoleLogViewHeightFunc(h) {
			var toggleHeight = (consoleShown) ? getWindowHeight()-(logHeight+64)-15 : getWindowHeight()-(32+15),
				viewHeight = (h == null) ? toggleHeight : getWindowHeight()-(h+64)-15;

			consoleLogBody.style.height = viewHeight+'px';
		}

		/**
		* General functionality to be done when a new entry is added to log.
	    */
		function consoleLogNewEntry() {
			consoleLogLogsUl.appendChild(consoleLogLogsLiExecute);
			consoleLogTextarea.value = '';
			consoleLogLatest();
			isExecute = false; // Reset variable & textarea value
		}
		
		// Loop through script tags on page.
		for(var i=0; i<scriptTags.length; i++){
			var scTagSrc = scriptTags[i].src;

			// Grab all script tags, if its console or console.min then check for param
			if(/.*console(\.min)?\.js/gi.test(scTagSrc) && scTagSrc.indexOf('?') > 0){
				var queries = scTagSrc.substring(scTagSrc.indexOf('?')+1, scTagSrc.length).split('&');

				// Implement queries
				for (var j=0, jj=queries.length; j<jj; j++) {
					var query = queries[j];

					if (Number(query)) {
						height = query;
					} else {
						consoleShown = (query == 'hide') ? false : true;
					}
				}
			}
		}

		document.body.innerHTML = '';

		// Added because IE 8 & 9 does support console.log, just needs to be enabled.
		if (isIE8or9()) {
			document.body.appendChild(consoleLogMessage);
			consoleLogMessage.appendChild(consoleLogMessageClose);

			consoleLogMessageClose.onclick = function() {
				document.body.removeChild(consoleLogMessage);
				return false;
			};
		}

		document.body.appendChild(consoleLogBody);
		document.getElementsByTagName('head')[0].appendChild(consoleLogStyle);

		consoleLog.appendChild(consoleLogHeader).appendChild(consoleLogToggle);
		consoleLog.appendChild(consoleLogLogs).appendChild(consoleLogMenuBar).appendChild(consoleLogHeightInput);
		consoleLogLogs.appendChild(consoleLogLogsUl);
		consoleLogLogsLiExecute.childNodes[1].appendChild(consoleLogTextarea);
		consoleLogLogsLiExecute.childNodes[1].appendChild(consoleLogExecuteBtn);
		consoleLogHeightInput.value = height;
		consoleLogLogsUl.appendChild(consoleLogLogsLiExecute);

		insertRules(document.styleSheets[document.styleSheets.length-1], '.console-log{position:fixed;bottom:0;width:100%;left:0;border-top:1px solid #a3a3a3;z-index:1;background:#fff}.consoleLogMessage{background:#fff;border:1px solid red;color:#333;padding:10px;text-align:center;position:absolute;top:10px;width:500px;left:50%;margin-left:-250px}.consoleLogMessage p{margin:0;padding:0;font-size:12px}.consoleLogMessage a{color:#333;font-weight:700;text-decoration:underline}.consoleLogMessage .closeConsoleMessage{position:absolute;display:block;width:40px;line-height:30px;text-align:center;top:0;right:0;text-decoration:none}.console-log a{color:#333;display:block;text-decoration:none;outline:none}.console-log-header,.console-log-header h6,.console-log-logs,.console-log-toggle{font-family:Lucida Grande,Lucida Sans,sans-serif;font-size:12px}.console-log-header{overflow:auto;background:#ececec;border-bottom:1px solid #a3a3a3}.console-log-header h6{margin:4px 0 0 10px;line-height:15px;border:1px solid #a3a3a3;border-bottom:0;float:left;background:#fff;padding:5px 8px 6px;font-weight:400}.console-log-toggle{padding:8px 0;text-align:right}.console-log-toggle span{background:#a3a3a3;color:#fff;font-size:11px;padding:4px;margin-right:4px}.console-log-logs{background:#fff;overflow:auto}.console-log-menu-bar{overflow:auto;border-bottom:1px solid #e6e6e6}.console-log-menu-bar span{float:left;font-size:11px;padding:4px 0 4px 8px;margin:4px 0;text-transform:uppercase;border-left:1px solid #a3a3a3}.console-log-menu-bar a{padding:8px 10px;text-decoration:none;color:#666;float:left}.console-log-menu-bar input{width:23px;padding:2px;margin:4px;float:left}.console-log-logs ul{overflow:auto;margin:0;padding:0;list-style-type:none}.console-log-logs li{clear:right;position:relative;min-height:16px;list-style-type:none;font-size:11px}.console-log-execute textarea,.console-log-logs-entry{font-family:Menlo,monospace;font-size:11px}.console-log-logs-entry{margin-left:28px;border-bottom:1px solid #f0f0f0;display:block;padding:4px 22px 4px 0;word-wrap:break-word;position:relative}.console-log-logs-sym{border:0;position:absolute;margin:0 0 0 12px;font-family:Century Gothic;font-weight:700;color:#acacac;font-size:12px;padding:3px 0}.console-log-execute{overflow:hidden}.console-log-execute .console-log-logs-entry{overflow:auto;padding-right:0}.console-log-execute .console-log-logs-sym{color:#2d7df9}.console-log-execute textarea{width:76%;float:left;padding:3px;height:30px}.console-log-execute a{display:block;float:right;width:21%;text-align:center;text-decoration:none;text-transform:uppercase;line-height:38px}'); // Replaced by a grunt task

		consoleLogHeightFunc(height);
		consoleLogToggleFunc();
		
		document.body.appendChild(consoleLog);

		// toggle click
		consoleLogToggle.onclick = function() {
			consoleShown = (consoleShown) ? false : true;
			consoleLogToggleFunc();
			return false;
		};

		// execute code button
		consoleLogExecuteBtn.onclick = function() {
			if (consoleLogTextarea.value !== '') {
				isExecute = true;
				console.log('<span style="color:#0080FF;">'+consoleLogTextarea.value+'</span>', eval(consoleLogTextarea.value));
				consoleLogLatest();
			}

			return false;
		};

		// clear button
		consoleLogMenuBar.childNodes[0].onclick = function() {
			var logs = consoleLogLogsUl.getElementsByTagName('li'),
				logsCount = logs.length;

			if (logsCount !== 1) {
				while (logsCount--) {
					if (logs[logsCount].id !== 'consoleLogLiExecute') {
						logs[logsCount].parentNode.removeChild(logs[logsCount]);
					}
				}
			}
			
			return false;
		};

		// height change 
		consoleLogHeightInput.onkeyup = function() {
			consoleLogHeightFunc(this.value);
			consoleLogLatest()
		};

		window.onerror = function(err, url, line) {
			var consoleLogLogsLi2 = CLcreate('li', {
				html: symbol+'<span class="console-log-logs-entry"><span style="color:red;">'+err+'\n'+url+'\n on line: '+line+'</span></span>'
			});
			consoleLogLogsUl.insertBefore(consoleLogLogsLi2, consoleLogLogsLiExecute);
			consoleLogLatest();
		};

		window.console = {
			log: function(){
				output = ''; // used to clear the output each time

				var htmlElem = function(p) {
					return ((p.length) ? p[0].nodeType : p.nodeType === 1) ? true : false;
				};

				if (isExecute) space = '<br>';

				try {
					// Loop through arguments passed in.
					for(var i=0; i<arguments.length; i++) {
						var param = arguments[i], pString = param.toString();

						// If the parameter is an object special functionality needs to happen.
						if ((typeof param).toLowerCase() == 'object') {
							if (pString == '[object Object]') {
	                            output = 'Object '+syntaxHighlighting('object', ObjToString(param))+space;
	                        } else if (pString.match(/^\[object */i)) {
	                        	if (pString.match(/^\[object HTML*/i) || htmlElem(param)) { // if param is HTML element
		                        	output = syntaxHighlighting('html', printHTML(param))+space;
	                        	} else { // Most likely window, document etc...
									output = '<span style="color:red;">ERROR: Maximum call stack size exceeded.<br><em>Object is too deeply nested.</em></span>'+space;	
	                        	}
	                        } else { // Most likely an array.
	                        	if (param.length > 1) {
	                        		output = '['+param+']';
	                        	}	                        	
	                        }
						} else {
							output += syntaxHighlighting(typeof param, param)+space;
						}
					}
				} catch(e) {
					// To account for js keywords
					if ((typeof param).toLowerCase() == 'object') { 
						output += syntaxHighlighting(typeof param, param)+space;
					} else {
						output += '<span style="color:red;">'+e+'</span>'+space;
					}
				}

				var consoleLogLogsLi = CLcreate('li', {'html':symbol+'<span class="console-log-logs-entry">'+output+'</span>'});
				consoleLogLogsUl.appendChild(consoleLogLogsLi);
				consoleLogNewEntry();			
			},

			time: function() {
				start = new Date().getMilliseconds();
			},

			timeEnd: function() {
				end = new Date().getMilliseconds();

				var consoleLogLogsLi = CLcreate('li', {'html':symbol+'<span class="console-log-logs-entry"><span style="color:#0080FF;">'+arguments[0]+': '+Math.abs(start-end)+'ms</span></span>'});
				consoleLogLogsUl.appendChild(consoleLogLogsLi);
				consoleLogNewEntry();
			}
		};
	}
})();