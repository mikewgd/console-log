(function () {	
	/**
	* UTILITIES
	* Functions to make accessing the DOM and other functionality easier.
	*/

	/**
	* @function $
	* Returns an element based on it's id.
	*
	* @param {String} id - the name of the id you would like to retrieve.
	*/
	function $(id) {
		return document.getElementById(id);
	}

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
	* @function objSize
	* Returns the size of an object.
	*
	* @param {Object} obj - object to be measured.
	*/
	function objSize(obj){
		var count = 0;
		
		for(var prop in obj){
			count++;
		}
		
		return count;
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
	// If the console is undefined or using a mobile device.
	if (typeof console == 'undefined' || isMobile()) {
		var output, 
			div = create('div', {id: 'consoleLog'}),
			ul = create('ul'), h6 = create('h6');
			
		h6.innerHTML = 'CONSOLE LOG';
		
		// Styles the individual elements: h6, ul and holder of logs.
		styleElement(div,{position:"fixed",bottom:"0",left: 0,width:"97%","fontSize":"12px",background:"#fff",zIndex:"999999999999999999999","fontFamily": "Arial"});
		styleElement(ul,{margin:0,padding:0,overflow:"auto",height:Math.round(window.innerHeight/4.5)+"px", "fontFamily":"Times New Roman","fontSize":"12px"});
		styleElement(h6,{margin:0,padding:"5px","fontSize":"13px","border-bottom":"1px solid #ccc"})
		
		div.appendChild(h6);
		div.appendChild(ul);
		
		// Overwrites the console
		window.console = {
			log: function(){
				output = ''; // used to clear the output each time
				
				for(var i=0; i<arguments.length; i++) {
					var param = arguments[i],
						li = create('li');
					
					// Each log is placed inside an li element.
					styleElement(li, {'padding': '5px 16px 5px 5px','background': 'white','border-bottom': '1px solid #ccc'});

					// If the parameter is an object special functionality needs to happen.
					if (typeof param == 'object') {
						output = 'Object '+JSON.stringify(param);
						
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
}());