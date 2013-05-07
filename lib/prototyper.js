var Prototyper = (function() {

	var _data = {};
	var _class = null;
	var _listeners = {};

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
	var replaceCommentWith = function(commentNode, value) {

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
				var newHTML = commentNode.parentNode.innerHTML.replace(r, content);
				if(typeof option != "undefined" && option.toString().charAt(0) === "x") {
					var iterations = parseInt(option.substr(1, option.length));
					var newHTMLMulti = "";
					for(var i=0; i<iterations; i++) {
						newHTMLMulti += newHTML;
					}
					parent.innerHTML = newHTMLMulti;
				} else {
					parent.innerHTML = newHTML;
				}
				callback();
			});
		}
	}
	api.data = function(callback, commentNode, data) {
		var value = resolveData(data.split("."), _data);
		var r = new RegExp("<!--" + commentNode.data + "-->", "gi");
		var parent = commentNode.parentNode;
		var newHTML = commentNode.parentNode.innerHTML.replace(r, value);
		parent.innerHTML = newHTML;
		callback();
	}
	api.tag = function(callback, commentNode, tagName) {
		var args =  Array.prototype.slice.call(arguments, 0);
		var callback = args.shift();
		var commentNode = args.shift();
		var tagName = args.shift();
		var attributes = args.toString();
		var attributesStr = '';
		var nodeValue = null;
		var tagStr = '';
		attributes = attributes.replace(/\(/gi, "");
		attributes = attributes.replace(/\)/gi, "");
		attributes = attributes.replace(/\,+/gi, ",");
		attributes = attributes.split(",");
		for(var i=0; i<attributes.length; i++) {
			var attrName = attributes[i].match(/[a-zA-Z]+=/gi)[0].replace(/=/, "");
			var attrValue = resolveData(attributes[i].match(/=\".+\"/gi)[0].replace(/=/, "").replace(/\"/g, "").split("."), _data);
			if(attrName != "nodeValue") {
				attributesStr += attrName + "=\"" + attrValue + "\"" + " ";
			} else {
				nodeValue = attrValue
			}
		}
		tagStr += '<' + tagName + ' ';
		tagStr += attributesStr;
		if(nodeValue != null) {
			tagStr += '>' + nodeValue + '</' + tagName + '>';
		} else {
			tagStr += '/>';
		}
		var parent = commentNode.parentNode; 
		var newHTML = commentNode.parentNode.innerHTML.toString().replace("<!--" + commentNode.data + "-->", tagStr);
		parent.innerHTML = newHTML;
		callback();
	}

	// main logic methods
	var _comments = [];
	var _processedComments = 0;
	var getComments = function(context) {		
		for(var i=0; i<context.length; i++) {
			if(typeof context[i].childNodes !== "undefined" && context[i].childNodes.length > 0) {
				getComments(context[i].childNodes);
			}
			if(context[i].nodeType === 8) {
				var comment = context[i];
				var command = parseCommand(comment.data);
				_processedComments += 1;
				if(api[command[0]]) {
					var method = command[0];
					var apiCallback = function() {
						getComments(context);
						commentProcessed();
					}
					command.splice(0, 1);
					var args = [apiCallback, comment].concat(command);
					api[method].apply(api, args);
				} else {
					console.log("%cPrototyper.js: Missing api method '" + command[0] + "'", "color: #F00;");
				}
				return;
			}
			if(context[i].attributes) {
				for(var j=0; j<context[i].attributes.length; j++) {
					var attrName = context[i].attributes[j].name;
					var attrValue = context[i].attributes[j].name;
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
	var setData = function(data) {
		_data = data;
		return _class;
	}
	var run = function() {
		getComments(document.querySelectorAll("body"));
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
		setData: setData,
		on: on,
		off: off
	}

})();