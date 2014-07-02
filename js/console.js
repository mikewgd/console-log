(function () {	
	/**
	* UTILITIES
	* Functions to make accessing the DOM and other functionality easier.
	*/

	/**
	* @function create
	* Returns an element to be created in the DOM and adds attributes.
	* NOTE: It is best to put it in a variable.
	* Usage: var test = ML.El.create(element, {'attribute': 'attributeValue'});
	*
	* @param {String} tag - tag you want to created, i.e "div", "span", etc...
	* @param {Object} args - arguments passed.
	*** @param {Object} attrs - attributes you want on the tag, i.e. class="test", src="img.jpg", etc...
	*/
	function create(element, arg) {
		var elem = document.createElement(element);

		if (arg) {
			var attrs = arg;

			for (var attr in attrs) {
				// IE does not support support setting class name with set attribute
				([attr] == 'class') ? elem.className = attrs[attr] : elem.setAttribute([attr], attrs[attr]);
			}
		}

		return elem;
	}

	/**
	* @function styleElement
	* Adds styles to an element.
	* Usage: ML.El.styl(element, 'display': 'none', 'overflow': 'hidden'});
	*
	* @param {HTMLElement} element - element you want styled.
	* @param {Object} args - arguments passed.
	*** @param {Object} arg.props - styles you want applied to the element.
	*/
	function styleElement(element, arg) {
		var props = arg;

		for (var prop in props) {
			element.style[prop] = props[prop];
		}
	}

	/**
	* @function isMobile
	* Returns true or false if we are viewing on a mobile or tablet device.
	*/
	function isMobile(){
		return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false;
	}

	// Credits: https://github.com/douglascrockford/JSON-js
	JSON.stringify = function (obj) {
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
				else if (t == "object" && v !== null) v = JSON.stringify(v);
				json.push((arr ? "" : '"' + n + '": ') + String(v));
			}
			return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
		}
	};

	// Start of the custom console.log
	// If the console is undefined or you are using a device.
	// User agent detection: Android, webOS, iPhone, iPad, iPod, Blackberry, IEMobile and Opera Mini
	if (typeof console == 'undefined' || isMobile()) {
		var output, consoleShown = true, 
			div = create('div', {id: 'consoleLog'}),
			header = create('div', {id: 'consoleLog-header'}),
			ul = create('ul', {id: 'consoleLog-ul'}),
			input = create('input', {id: 'consoleLog-input', type: 'text', value: Math.round(window.innerHeight/4), maxlength: 3}),
			oldConsole = console;
			
		header.innerHTML = '<h6 style="margin:5px 3px;padding:0;float:left;font-size:13px;">CONSOLE LOG</h6>'+
						   '<a id="consoleLog-toggle" href="javascript:void(0);" style="padding:5px; display:block;font-weight:bold;float:right;color:#ccc;text-decoration:none;font-size:13px;">[click to hide]</a>'+
						   '<span style="float:right;margin-right:10px;">Height: </span>';
						   
		// Styles the individual elements
		styleElement(div,{margin:0, padding:0,position:"fixed",bottom:"0",left: 0,width:"100%","fontSize":"12px",background:"#fff",zIndex:"999999999999999999999","fontFamily": "Arial", 'border-top':'1px solid #999'});
		styleElement(ul,{margin:0, padding:0,overflow:"auto",height:Math.round(window.innerHeight/4)+"px", "fontFamily":"Times New Roman","fontSize":"12px", 'color': '#000000'});
		styleElement(header,{'overflow': 'auto', margin:0, padding:"2px", "border-bottom":"1px solid #ccc", 'color': '#000000'});
		styleElement(input, {"fontFamily":"Times New Roman","fontSize":"12px", 'color': '#000000', 'width': '25px', 'padding': '2px'})

		div.appendChild(header);
		div.appendChild(ul);
		header.getElementsByTagName('span')[0].appendChild(input);
		
		// Toggle console
		document.onclick = function(e){
			var element = e.target || e.srcElement;
        	if (element.nodeType == 3) element = element.parentNode; // http://www.quirksmode.org/js/events_properties.html
			
			if (element.id == 'consoleLog-toggle') {
				ul.style.display = (consoleShown) ? 'none' : 'block';
				consoleShown = (consoleShown) ? false : true;
				element.innerHTML = '[click to '+((!consoleShown) ? 'show' : 'hide')+']';
			}
		};

		// Change height 
		input.onkeyup = function(e) {
			if (isNaN(this.value) || this.value == '') {
				this.value = this.defaultValue;
			}

			ul.style.height = this.value+'px';
		};
		
		// Overwrites the console
		window.console = {
			log: function(){
				output = ''; // used to clear the output each time				
								
				for(var i=0; i<arguments.length; i++) {
					var param = arguments[i],
						li = create('li');

					// Each log is placed inside an li element.
					styleElement(li, {'padding': '5px 16px 5px 5px','background': 'white','border-bottom': '1px solid #ccc', 'color': '#000000'});

					// If the parameter is an object special functionality needs to happen.
					if (typeof param == 'object') {
						if (param.tagName || param[0] !== undefined || param.window || (param.parentNode == null && param.childNodes)) {
							var el = (param[0] !== undefined) ? param[0] : param;
							if (param.window) el.nodeName = 'window';

							output += el.nodeName+'<br />'+
									  '<em>* For more information, please log a specific aspect of the '+el.nodeName+' element. For example its id, attributes, length, childNodes and/or etc...</em>';
						} else {
							if (param.toString() == '[object Object]') {
								output += '<span style="display:block;">Object '+JSON.stringify(param)+'</span>';
							} else {
								output += param;
							}
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
			}
		}
	}
	// end of IF console is undefined or isMobile()
}());