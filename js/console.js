(function () {	
	/**
	* UTILITIES
	* Functions to make accessing the DOM and other functionality easier.
	*/

	/**
	* @function CLcreate
	* Returns an element to be created in the DOM and adds attributes.
	* NOTE: It is best to put it in a variable.
	*
	* @param {String} tag - tag you want to created, i.e "div", "span", etc...
	* @param {Object} attrs - attributes you want on the tag, i.e. class="test", src="img.jpg", etc...
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
	* @function CLisMobile
	* Returns true or false if we are viewing on a mobile or tablet device.
	*/
	function CLisMobile(){
		return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false;
	}

	/**
	* @function ObjToString
	* Returns an Object as a string
	* Credits go to https://github.com/douglascrockford/JSON-js
	* Code was modified to fit certain needs.
	*
	* @param {Object} obj - object being passed
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
		* @function quote
		* Returns string with quotes
		*
		* @param {String} string - string being passed to surround with quotes.
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
	* @function syntaxHighlighting
	* Returns string with HTML surrounding, used for coloring.
	*
	* @param {String} type - type of argument being passed, i.e. number, null, etc..
	* @param {String} str - string being passed to surround with.
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
	* @function printHTML
	* Returns HTML as a string.
	*
	* @param {HTMLElement/Object} el - the element to be parsed.
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
	* Start of custom console.log
	*/

	// If the console is undefined or you are using a device.
	// User agent detection: Android, webOS, iPhone, iPad, iPod, Blackberry, IEMobile and Opera Mini
	if (typeof console == 'undefined' || CLisMobile()) { 
		var scriptTags = document.getElementsByTagName('script'),
			consoleShown = true, output, space = ' ', 
			windowHeight = window.innerHeight || document.body.clientHeight,
			height = Math.round(windowHeight/3), newHeight, start, end,
			isExecute = false, symbol = '<span class="console-log-logs-sym">&gt;</span>',
			consoleLog = CLcreate('div', {id: 'consoleLog', 'class': 'console-log'}),
			consoleLogStyles = '{{consoleLogStyles}}',
			consoleLogStyle = CLcreate('style', {'type': 'text/css', 'id': 'consoleLogStyle', 
				'html': consoleLogStyles
			}),
			consoleLogBody = CLcreate('div', {id: 'consoleLogBody', 'class': 'console-log-body cl-scroll', 'style': 'overflow: auto;', 'html': document.body.innerHTML}),
			consoleLogHeader = CLcreate('div', {'class': 'console-log-header', 'html': '<h6>Console.Log</h6>'}),
			consoleLogToggle = CLcreate('a', {href: '#', 'class': 'console-log-toggle', 'html': '<span>Click to hide</span>'}),
			consoleLogLogs = CLcreate('div', {'class': 'console-log-logs'}),
			consoleLogLogsUl = CLcreate('ul'),
			consoleLogMenuBar = CLcreate('div', {'class': 'console-log-menu-bar', 'html': '<a href="#">CLEAR</a><span>Height:</span>'}),
			consoleLogLogsLiExecute = CLcreate('li', {'id': 'consoleLogLiExecute','class': 'console-log-execute', 'html': '<span class="console-log-logs-sym">&gt;</span><span class="console-log-logs-entry"></span>'}),
			consoleLogTextarea = CLcreate('textarea', {id: 'consoleLogExecuteTextArea', 'name': 'consoleLogExecuteTextArea'}),
			consoleLogExecuteBtn = CLcreate('a', {href: '#', 'html': 'Execute'}),
			consoleLogHeightInput = CLcreate('input', {id: 'consoleLogHeightInput', 'class': 'console-log-text-input', type: 'text', value: height, maxlength: 3}),
			consoleLogToggleFunc = function() {
				var toggleTxt = (consoleShown) ? 'hide' : 'show',
					toggleElem = consoleLogToggle.getElementsByTagName('span')[0];
        
				toggleElem.innerHTML = 'Click to '+toggleTxt;
				consoleLogLogs.style.display = (consoleShown) ? 'block' : 'none';

				if (consoleShown) {consoleLogLogsUl.scrollTop = consoleLogLogsUl.scrollHeight;}
				consoleLogViewHeightFunc();
			},
			consoleLogHeightFunc = function(h, defVal) {
				var val = Number(h),
					winHeight = windowHeight-32;

				// Added 32 to account for title bar
				if (val <= winHeight && val >= defVal) {
					newHeight = Number(val);
				} else {
					newHeight = Number((val > winHeight) ? winHeight : defVal);
				}

				consoleLogLogsUl.style.height = newHeight+'px';
			},
			consoleLogViewHeightFunc = function() {
				var consoleLogHeight = (consoleLog.offsetHeight === 0) ? newHeight+64 : consoleLog.offsetHeight;

				if (!consoleShown) {
					consoleLogHeight = 33;
				}

				consoleLogBody.style.height = (windowHeight-15)-consoleLogHeight+'px';
			};
		
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
						height = (query > windowHeight-32) ? windowHeight-32 : query;
					} else {
						consoleShown = (query == 'hide') ? false : true;
					}
				}
			}
		}

		document.body.innerHTML = '';
		document.body.appendChild(consoleLogBody);
		document.getElementsByTagName('head')[0].appendChild(consoleLogStyle);

		consoleLog.appendChild(consoleLogHeader).appendChild(consoleLogToggle);
		consoleLog.appendChild(consoleLogLogs).appendChild(consoleLogMenuBar).appendChild(consoleLogHeightInput);
		consoleLogLogs.appendChild(consoleLogLogsUl);
		consoleLogLogsLiExecute.childNodes[1].appendChild(consoleLogTextarea);
		consoleLogLogsLiExecute.childNodes[1].appendChild(consoleLogExecuteBtn);
		consoleLogHeightInput.value = height;

		// function calls
		consoleLogHeightFunc(height, height);
		consoleLogToggleFunc();
		
		document.body.appendChild(consoleLog);

		var consoleLogNewEntry = function() {
			// document.getElementById('consoleLogLiExecute').parentNode.removeChild(consoleLogLogsLiExecute);
			consoleLogLogsUl.appendChild(consoleLogLogsLiExecute);

			consoleLogTextarea.value = '';

			// Scroll to latest log
			consoleLogLogsUl.scrollTop = consoleLogLogsUl.scrollHeight;

			// Reset variable & textarea value
			isExecute = false;
		};

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
			}

			return false;
		};

		// clear button
		consoleLogMenuBar.childNodes[0].onclick = function() {
			consoleLogLogsUl.innerHTML = '';
			consoleLogLogsUl.appendChild(consoleLogLogsLiExecute);
			return false;
		};

		// height change 
		consoleLogHeightInput.onkeyup = function() {
			consoleLogHeightFunc(this.value, this.defaultValue);
			consoleLogViewHeightFunc();
			consoleLogLogsUl.scrollTop = consoleLogLogsUl.scrollHeight; // always keep at bottom
		};

		window.onerror = function(err, url, line) {
			var consoleLogLogsLi2 = CLcreate('li', {
				html: symbol+'<span class="console-log-logs-entry"><span style="color:red;">'+err+'\n'+url+'\n on line: '+line+'</span></span>'
			});
			consoleLogLogsUl.insertBefore(consoleLogLogsLi2, consoleLogLogsLiExecute);

			// Scroll to latest log
			consoleLogLogsUl.scrollTop = consoleLogLogsUl.scrollHeight;
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

						// oldconsole.log(typeof param)

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
}());