(function () {	
	var isTouch = true;

	function create(e,t){var n=document.createElement(e);if(t){var r=t;for(var i in r){[i]=="class"?n.className=r[i]:n.setAttribute([i],r[i])}}return n}
	function $(e){return document.getElementById(e)}
	function objSize(e){var t=0;for(var n in e){t++}return t}
	function styleElement(e,t){var n=t;for(var r in n){e.style[r]=n[r]}}
	function isMobile(){return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false;}

	if (typeof console == 'undefined' || isMobile()) {
		var output, 
			div = create('div', {id: 'consoleLog'}),
			ul = create('ul'),
			h6 = create('h6'),
			oldConsole = console;

		h6.innerHTML = 'console log';

		styleElement(div,{position:"fixed",bottom:"0",width:"97%","font-size":"12px",background:"#fff",zIndex:"999999999999999999999"});
		styleElement(ul,{margin:0,padding:0,overflow:"auto",height:Math.round(window.innerHeight/4.5)+"px"});
		styleElement(h6,{margin:0,padding:"5px","text-transform":"uppercase","font-size":"13px","border-bottom":"1px solid #ccc"})

		document.body.appendChild(div);
		div.appendChild(h6);
		div.appendChild(ul);
		
		window.debug = { //TODO change to console, attach to window
			logg: function(){
				output = '';
				for(var i=0; i<arguments.length; i++) {

					var param = arguments[i];
					
					var li = create('li');
					styleElement(li, {'padding': '5px','background': 'white','border-bottom': '1px solid #ccc'});

					if (typeof param == 'object') {
						var count = 0;
						output = 'Object {';

						for (var prop in param) {
							count++;
							output += (count == objSize(param)) ? prop+': "'+param[prop]+'"}' : prop+': "'+param[prop]+'", ';					
						}

						if (param == null) {
							output = 'null';
						}
					} else {
						output += param;
					}
				}

				li.innerHTML = output;
				ul.appendChild(li);
			},
			
			error: function (p) {
				alert(p)
			}
		}
	}
}());