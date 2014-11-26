(function () {
	/**
	* UTILITIES
	* Functions to make accessing the DOM and other functionality easier.
	*/

	/**
	* @function CLcreate
	* Returns an element to be created in the DOM and adds attributes.
	* NOTE: It is best to put it in a variable.
	* Usage: var test = ML.El.CLcreate(element, {'attribute': 'attributeValue'});
	*
	* @param {String} tag - tag you want to created, i.e "div", "span", etc...
	* @param {Object} attrs - attributes you want on the tag, i.e. class="test", src="img.jpg", etc...
	*/
	function CLcreate(element, attrs) {
		var elem = document.createElement(element);

		if (attrs) {
			for (var attr in attrs) {
				// IE does not support support setting class name with set attribute
				([attr] == 'class') ? elem.className = attrs[attr] : elem.setAttribute([attr], attrs[attr]);
			}
		}

		return elem;
	}

	/**
	* @function CLstyleElement
	* Adds styles to an element.
	* Usage: ML.El.styl(element, 'display': 'none', 'overflow': 'hidden'});
	*
	* @param {HTMLElement} element - element you want styled.
	* @param {Object} props - styles you want applied to the element.
	*/
	function CLstyleElement(element, props) {
		for (var prop in props) {
			element.style[prop] = props[prop];
		}
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

	    String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
	        return this.valueOf();
	    };

	    var quote = function(string) {
	        escapable.lastIndex = 0;
	        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
	            var c = meta[a];
	            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	        }) + '"' : '"' + string + '"';
	    };

	    for (i = 0; i < 4; i += 1) {
	        indent += ' ';
	    }

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
			for (var i=0; i<el.length; i++) {
				var breakLine = document.createTextNode('\n');
				elem = el[i].cloneNode(true);

				outputDiv.appendChild(elem);
				outputDiv.appendChild(breakLine);
			}
		}

		html = outputDiv.innerHTML;
		
		// Replace entities
		html = html.replace(/</g,'&lt;').replace(/>/g,'&gt;');

		// Added in for IE
		html = html.replace(/&lt;\/?([A-Z]+)/g, function(x) {return x.toLowerCase();});
		html = html.replace(/([a-zA-Z]+)=([a-zA-Z]+-?[a-zA-Z]+)/g, '$1="$2"');

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
			height = Math.round(windowHeight/4),
			div = CLcreate('div', {id: 'consoleLog'}),
			header = CLcreate('div', {id: 'consoleLog-header'}),
			ul = CLcreate('ul', {id: 'consoleLog-ul'}),
			input = CLcreate('input', {id: 'consoleLog-input', type: 'text', value: height, maxlength: 3}),
			toggleText = '['+((!consoleShown) ? 'show' : 'hide')+']',
			liExecute = CLcreate('li', {id: 'consoleLog-liExecute', 'class': 'li-execute'}),
			inputExecute = CLcreate('textarea', {id: 'consoleLog-inputExecute'}),
			isExecute = false;

		// Loop through script tags on page.
		for(var i=0; i<scriptTags.length; i++){
			var scTagSrc = scriptTags[i].src;

			// Grab all script tags, if its console or console.min then check for param
			if(/.*console(\.min)?\.js/gi.test(scTagSrc) && scTagSrc.indexOf('?') > 0){
				var queries = scTagSrc.substring(scTagSrc.indexOf('?')+1, scTagSrc.length).split('&');

				// Implement queries
				for (var j=0; j<queries.length; j++) {
					var query = queries[j];

					if (Number(query)) {
						height = (query > windowHeight-30) ? windowHeight-30 : query;
					} else {
						consoleShown = (query == 'hide') ? false : true;
					}
				}
			}
		}

		header.innerHTML = '<h6 style="margin:5px 3px;padding:0;float:left;font-size:13px;">CONSOLE LOG</h6>'+
						   '<a id="consoleLog-toggle" href="javascript:void(0);" style="padding:5px; display:block;font-weight:bold;float:right;color:#ccc;text-decoration:none;font-size:13px;">'+toggleText+'</a>'+
						   '<span style="float:right;margin-right:10px;">Height: </span>';

		// Styles the individual elements
		CLstyleElement(div,{'margin':0, 'padding':0,'position':"fixed",bottom:"0",left: 0,width:"100%","fontSize":"12px",background:"#fff",zIndex:"999999999999999999999","fontFamily": "Arial", 'borderTop':'1px solid #999999'});
		CLstyleElement(ul,{margin:0, padding:0,overflow:"auto",height:height+"px", "fontFamily":"Times New Roman","fontSize":"12px", 'color': '#000000'});
		CLstyleElement(header,{'overflow': 'auto', margin:0, padding:"2px", "borderBottom":"1px solid #ccc", 'color': '#000000'});
		CLstyleElement(input, {"fontFamily":"Times New Roman","fontSize":"12px", 'color': '#000000', 'width': '25px', 'padding': '2px'});
		CLstyleElement(inputExecute, {"fontFamily":"Times New Roman","fontSize":"12px", 'color': '#000000','padding': '2px', 'width':'76%', 'float': 'left'});

		div.appendChild(header);
		div.appendChild(ul);
		header.getElementsByTagName('span')[0].appendChild(input);
		document.body.appendChild(div);

		// Initially display or hide console.
		ul.style.display = (!consoleShown) ? 'none' : 'block';

		/**
		* EVENTS
		*/

		// Toggle console
		document.onclick = function(e){
			// http://www.quirksmode.org/js/events_properties.html
			if (!e) e = window.event;
			var element = e.target || e.srcElement;
			if (element.nodeType == 3) // defeat Safari bug
				element = element.parentNode;

			if (element.id == 'consoleLog-toggle') {
				ul.style.display = (consoleShown) ? 'none' : 'block';
				consoleShown = (consoleShown) ? false : true;
				element.innerHTML = '['+((!consoleShown) ? 'show' : 'hide')+']';
			} else if (element.id == 'consoleLog-executeBtn') {
				isExecute = true;
				console.log(inputExecute.value, eval(inputExecute.value));
			}
		};

		window.onerror = function(err, url, line) {
			console.log(err+'\n'+url+'\n on line: '+line);
		};

		// Change height
		input.onkeyup = function() {
			var val = Number(this.value),
				newHeight,
				winHeight = windowHeight-30;

			// Added 30 to account for title bar
			if (val <= winHeight && val >= this.defaultValue) {
				newHeight = this.value;
			} else {
				newHeight = (this.value > winHeight) ? winHeight : this.defaultValue;
			}

			ul.style.height = newHeight+'px';
			ul.scrollTop = ul.scrollHeight; // always keep at bottom
		};

		window.console = {
			log: function(){
				output = ''; // used to clear the output each time

				try {
					var htmlElem = function(p) {
						return ((p.length) ? p[0].nodeType : p.nodeType === 1) ? true : false;
					};

					if (isExecute) space = '<br>';
 
					// Loop through arguments passed in.
					for(var i=0; i<arguments.length; i++) {
						var param = arguments[i], li = CLcreate('li'), pString = param.toString();

						// If the parameter is an object special functionality needs to happen.
						if ((typeof param).toLowerCase() == 'object') {
							if (pString == '[object Object]') {
	                            output += '<span style="display:block;word-break:break-all;">Object '+ObjToString(param)+'</span>'+space;
	                        } else if (pString.match(/^\[object */i)) {
	                        	if (pString.match(/^\[object HTML*/i) || htmlElem(param)) { // if param is HTML element
		                        	output += printHTML(param)+space;
	                        	} else { // Most likely window, document etc...
									output += 'ERROR: Maximum call stack size exceeded.<br><em>Object is too deeply nested.</em>'+space;	
	                        	}
	                        } else {
	                            output += param+space;
	                        }
						} else {
							output += param+space;
						}
						
					}
				} catch(e) {
					output += e+space;
				}

				// Style li elements
				CLstyleElement(li, {'padding': '5px 16px 5px 5px','background': 'white','borderBottom': '1px solid #ccc', 'color': '#000000'});
				CLstyleElement(liExecute, {'position': 'relative', 'overflow':'hidden', 'padding': '5px','background': 'white','borderBottom': '1px solid #ccc', 'color': '#000000'});
				
				li.innerHTML = output;
				ul.appendChild(li);
				
				ul.appendChild(liExecute);
				liExecute.innerHTML = '<a href="#" style="display:block;width:21%;text-align:center;padding:10px 0;height:80%;position:absolute;right:0;top:5px;" id="consoleLog-executeBtn">EXECUTE</a>';
				liExecute.appendChild(inputExecute);

				// Scroll to latest log
				ul.scrollTop = ul.scrollHeight;

				// Reset variable & textarea value
				isExecute = false;
				inputExecute.value = '';
			}
		};
	}
}());