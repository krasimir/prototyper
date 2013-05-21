var prototyper = (function() {

	var _data = {};
	var _class = null;
	var _listeners = {};
	var _comments = [];
	var _processedComments = 0;

	// utils
	var parseCommand = function(data) {
		data = clearEmpties(data);
		data = data.split(" ");
		return data;
	}
	var clearEmpties = function(data) {
		if(data.charAt(0) === " ") {
			data = data.substr(1, data.length);
			return clearEmpties(data);
		} else if(data.charAt(data.length-1) === " ") {
			data = data.substr(0, data.length-1);
			return clearEmpties(data);
		} else {
			return data;
		}
	}
	var resolveData = function(path, obj) {		
		var part = path.shift();
		if(obj) {
			if(obj[part]) {
				if(path.length == 0) return obj[part];
				if(obj[part] instanceof Array) {
					if(!obj[part + "___index" + path]) obj[part + "___index" + path] = 0;
					return resolveData(path, obj[part][obj[part + "___index" + path]++]);
				} else {
					return resolveData(path, obj[part]);
				}
			} else {
				return part;
			}
		} else {
			return part;
		}
	}

	// ajax request
	var getFile = function(file, callback) {
		var xmlhttp;
		if (window.XMLHttpRequest) {
	  		xmlhttp = new XMLHttpRequest();
	  	} else {
	  		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	  	}
		xmlhttp.onreadystatechange = function() {
	  		if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	    		callback(xmlhttp.responseText);
	    	}
	  	}
		xmlhttp.open("GET", file, true);
		xmlhttp.send();
	}

	// api definition
	var api = {};
	api.include = function(callback, commentNode, file, option) {
		if(typeof file !== "undefined") {
			getFile(file, function(content) {
				var r = new RegExp("<!--" + commentNode.data + "-->", "gi");
				var parent = commentNode.parentNode;
				if(typeof option != "undefined" && option.toString().charAt(0) === "x") {
					var iterations = parseInt(option.substr(1, option.length));
					var newHTMLMulti = "";
					for(var i=0; i<iterations; i++) {
						newHTMLMulti += content;
					}
					var newHTML = commentNode.parentNode.innerHTML.replace(r, newHTMLMulti);
					parent.innerHTML = newHTML;
				} else {
					var newHTML = commentNode.parentNode.innerHTML.replace(r, content);
					parent.innerHTML = newHTML;
				}
				callback();
			});
		}
	}

	// main logic methods
	var parseDOM = function(context) {		
		for(var i=0; i<context.length; i++) {

			if(typeof context[i].childNodes !== "undefined" && context[i].childNodes.length > 0) {
				parseDOM(context[i].childNodes);
			}

			// operates with comment node
			if(context[i].nodeType === 8) {
				var comment = context[i];
				var command = parseCommand(comment.data);
				_processedComments += 1;
				if(api[command[0]]) {
					var method = command[0];
					var apiCallback = function() {
						parseDOM(context);
						commentProcessed();
					}
					command.splice(0, 1);
					var args = [apiCallback, comment].concat(command);
					api[method].apply(api, args);
				} else {
					console.log("%cPrototyper.js: Missing api method '" + command[0] + "'", "color: #F00;");
					commentProcessed();
				}
				return;
			} else if(context[i].nodeType === 3 && context[i].data.match(/\{\{.+\}\}/gi) != null) {
				context[i].data = resolveData(context[i].data.match(/\{\{.+\}\}/gi)[0].replace(/\{/gi, "").replace(/\}/gi, "").split("."), _data);
			}

			// checks attributes for data
			if(context[i].attributes) {
				for(var j=0; j<context[i].attributes.length; j++) {
					var attrName = context[i].attributes[j].name;
					var attrValue = context[i].attributes[j].value;
					if(attrValue.match(/\{\{.+\}\}/gi) != null) {
						context[i].setAttribute(attrName, resolveData(attrValue.match(/\{\{.+\}\}/gi)[0].replace(/\{/gi, "").replace(/\}/gi, "").split("."), _data))
					}
				}
			}
		}
	}
	var commentProcessed = function() {
		_processedComments -= 1;
		if(_processedComments === 0) {
			dispatch("done");
		}
	}
	var run = function(domElement, data) {
		_comments = [];
		_processedComments = 0;
		_data = data;
		parseDOM(domElement);
		return _class;
	}

	// observering
	var on = function(eventType, callback) {
		if(!_listeners[eventType]) _listeners[eventType] = [];
		_listeners[eventType].push(callback);
		return _class;
	}
	var off = function(eventType, callback) {
		if(_listeners[eventType]) {
			var newArr = [];
			for(var i=0; i<_listeners[eventType].length; i++) {
				if(_listeners[eventType][i] !== callback) {
					newArr.push(_listeners[eventType][i]);
				}
			}
			_listeners[eventType] = newArr;
		}
		return _class;
	}
	var dispatch = function(eventType, data) {
		if(_listeners[eventType]) {
			for(var i=0; i<_listeners[eventType].length; i++) {
				_listeners[eventType][i](data);
			}
		}
	}

	return _class = {
		run: run,
		on: on,
		off: off
	}

})();