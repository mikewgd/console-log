(function () {	
	/**
	* @functions
	* Some general functions to make coding easier.
	* These functions include:
	* -- creating element on the fly (with attributes),
	* -- get element by id shortcut
	* -- getting the size of an Object
	* -- styling an element using an Object
	* -- device detection
	*/
	var objKeyHTML = '';
	function create(e,t){var n=document.createElement(e);if(t){var r=t;for(var i in r){[i]=="class"?n.className=r[i]:n.setAttribute([i],r[i])}}return n}
	function $(e){return document.getElementById(e)}
	function objSize(e){var t=0;for(var n in e){t++}return t}
	function styleElement(e,t){var n=t;for(var r in n){e.style[r]=n[r]}}
	function isMobile(){return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false;}
	function objectKeys(data, num) {
		for (var key in data) {
			if (typeof(data[key]) == "object" && data[key] != null) {
				//alert("Key: " + key + "\nValues: " + data[key]);
				
				objKeyHTML += key+': {';
				objectKeys(data[key]);
			} else {
				if (Object.prototype.toString.call(data[key]) === '[object Array]') {
					//objKeyHTML += data[key]+", ";
				} else {
					objKeyHTML += key+": "+data[key]+", ";
				}
			}
		}
	}

	// Start of the custom console.log
	// If the console is undefined or using a mobile device.
	if (typeof console == 'undefined' || isMobile()) {
		var output, 
			div = create('div', {id: 'consoleLog'}),
			ul = create('ul'), h6 = create('h6'),
			count = 0, // Simple counter
			oldConsole = console; // keep the old console just in case.

		h6.innerHTML = 'CONSOLE LOG';
		
		// Styles the individual elements: h6 & ul
		styleElement(div,{position:"fixed",bottom:"0",left: 0,width:"97%","font-size":"12px",background:"#fff",zIndex:"999999999999999999999"});
		styleElement(ul,{margin:0,padding:0,overflow:"auto",height:Math.round(window.innerHeight/4.5)+"px"});
		styleElement(h6,{margin:0,padding:"5px","font-size":"13px","border-bottom":"1px solid #ccc"})
		
		div.appendChild(h6);
		div.appendChild(ul);
		
		// Overwrites the console
		window.console = {
			log: function(){
				output = ''; // used to clear the output each time
				count++;
				
				for(var i=0; i<arguments.length; i++) {
					var param = arguments[i],
						li = create('li'),
						objCount = 0;
					
					// Each log is placed inside an li element.
					styleElement(li, {'padding': '5px','background': 'white','border-bottom': '1px solid #ccc'});

					// If the parameter is an object special functionality needs to happen.
					if (typeof param == 'object') {
						
						for (var prop in param) {
							var value = param[prop];
							objCount++;
							objKeyHTML = '';
							
							if (Object.prototype.toString.call(value) === '[object Array]') {
								objectKeys(value, objCount);
								output += prop+': ['+objKeyHTML+'], ';
							} else if (typeof value == 'object') {
								objectKeys(value, objCount);
								output += prop+': {'+objKeyHTML+'}, ';
							} else {
								output += prop+': '+value+', '
							}
						}
						
						output = 'Object {'+output+'}';
						output = output.replace(/, \}+/g, '}');
						output = output.replace(/, \]+/g, ']');
						
						// Since null keyword is an object
						if (param == null) {output = 'null';}
					} else {
						output += param;
					}
				}
				
				li.innerHTML = output;
				ul.appendChild(li);
				document.body.appendChild(div);
			},
			
			error: function(){},
			
			info: function(){}
		}
	}
}());