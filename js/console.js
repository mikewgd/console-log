(function () {
	oldConsole = console;
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

	// Credits: https://github.com/douglascrockford/JSON-js
	function JSONstringify(obj) {
		var t = typeof (obj);
		if (t != "object" || obj === null) {
			// simple data type
			if (t == "string") obj = '"'+obj+'"';
			return String(obj);
		}
		else {
			// recurse array or object
			var n, v, json = [], arr = (obj && obj.constructor == Array);
			for (n in obj) {
				v = obj[n]; t = typeof(v);
				if (t == "string") v = '"'+v+'"';
				else if (t == "object" && v !== null) v = JSONstringify(v);
				json.push((arr ? "" : '"' + n + '": ') + String(v));
			}
			return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
		}
	}

	/**
	* @function printHTML
	* Returns HTML as a string.
	*
	* @param {HTMLElement/Object} el - the element to be parsed.
	*/
	function printHTML(el) {
		var outputDiv = CLcreate('div'),
			elem;
			
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
		
		// Replace entities
		outputDiv.innerHTML = outputDiv.innerHTML.replace(/</g,'&lt;').replace(/>/g,'&gt;');
		return outputDiv.innerHTML.replace(/\n/g, '<br>'); // Add breaking space
	}

	/** 
	* Start of custom console.log
	*/

	// If the console is undefined or you are using a device.
	// User agent detection: Android, webOS, iPhone, iPad, iPod, Blackberry, IEMobile and Opera Mini
	if (typeof console == 'undefined' || CLisMobile()) {

		var scriptTags = document.getElementsByTagName('script'),
			consoleShown = true,
			windowHeight = window.innerHeight,
			height = Math.round(windowHeight/4);

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
						height = (query > windowHeight-30) ? windowHeight-30 : query
					} else {
						consoleShown = (query == 'hide') ? false : true;
					}
				}
			}
		}

		var output, 
			div = CLcreate('div', {id: 'consoleLog'}),
			header = CLcreate('div', {id: 'consoleLog-header'}),
			ul = CLcreate('ul', {id: 'consoleLog-ul'}),
			input = CLcreate('input', {id: 'consoleLog-input', type: 'text', value: height, maxlength: 3}),
			oldConsole = console,
			toggleText = '['+((!consoleShown) ? 'show' : 'hide')+']';

		header.innerHTML = '<h6 style="margin:5px 3px;padding:0;float:left;font-size:13px;">CONSOLE LOG</h6>'+
						   '<a id="consoleLog-toggle" href="javascript:void(0);" style="padding:5px; display:block;font-weight:bold;float:right;color:#ccc;text-decoration:none;font-size:13px;">'+toggleText+'</a>'+
						   '<span style="float:right;margin-right:10px;">Height: </span>';

		// Styles the individual elements
		CLstyleElement(div,{margin:0, padding:0,position:"fixed",bottom:"0",left: 0,width:"100%","fontSize":"12px",background:"#fff",zIndex:"999999999999999999999","fontFamily": "Arial", 'border-top':'1px solid #999'});
		CLstyleElement(ul,{margin:0, padding:0,overflow:"auto",height:height+"px", "fontFamily":"Times New Roman","fontSize":"12px", 'color': '#000000'});
		CLstyleElement(header,{'overflow': 'auto', margin:0, padding:"2px", "border-bottom":"1px solid #ccc", 'color': '#000000'});
		CLstyleElement(input, {"fontFamily":"Times New Roman","fontSize":"12px", 'color': '#000000', 'width': '25px', 'padding': '2px'})

		div.appendChild(header);
		div.appendChild(ul);
		header.getElementsByTagName('span')[0].appendChild(input);

		// Initially display or hide console.
		ul.style.display = (!consoleShown) ? 'none' : 'block';

		/**
		* EVENTS
		*/

		// Toggle console
		document.onclick = function(e){
			var element = e.target || e.srcElement;
        	if (element.nodeType == 3) element = element.parentNode; // http://www.quirksmode.org/js/events_properties.html

			if (element.id == 'consoleLog-toggle') {
				ul.style.display = (consoleShown) ? 'none' : 'block';
				consoleShown = (consoleShown) ? false : true;
				element.innerHTML = '['+((!consoleShown) ? 'show' : 'hide')+']';
			}
		};

		// Change height
		input.onkeyup = function(e) {
			var val = Number(this.value),
				newHeight,
				windowHeight = windowHeight-30;

			// Added 30 to account for title bar
			if (val <= windowHeight && val >= this.defaultValue) {
				newHeight = this.value;
			} else {
				newHeight = (this.value > windowHeight) ? windowHeight : this.defaultValue;
			}

			ul.style.height = newHeight+'px';
			ul.scrollTop = ul.scrollHeight; // always keep at bottom
		};

		window.console = {
			log: function(){
				output = ''; // used to clear the output each time

				// Loop through arguments passed in.
				for(var i=0; i<arguments.length; i++) {
					var param = arguments[i],
						li = CLcreate('li'),
						pString = param.toString();

					// Each log is placed inside an li element.
					CLstyleElement(li, {'padding': '5px 16px 5px 5px','background': 'white','border-bottom': '1px solid #ccc', 'color': '#000000'});

					// If the parameter is an object special functionality needs to happen.
					if ((typeof param).toLowerCase() == 'object') {
						if (pString == '[object Object]') {
                            output += '<span style="display:block;">Object '+JSONstringify(param)+'</span>';
                        } else if (pString.match(/^\[object */i)) {
                        	if (pString.match(/^\[object HTML*/i)) { // if param is HTML element
	                        	output += printHTML(param);
                        	} else { // Most likely window, document etc...
								output += 'ERROR: Maximum call stack size exceeded.<br><em>Object is too deeply nested.</em>';	
                        	}
                        } else {
                            output += param;
                        }

						// Since null keyword is an object
						if (param == null) {output = 'null';}
					} else {
						output += param;
					}
				}

				li.innerHTML = output;
				ul.appendChild(li);
				document.body.appendChild(div);

				// Scroll to latest log
				ul.scrollTop = ul.scrollHeight;
			}
		}
	}
}());