var PR = (function() {

	var _data = {};

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
	var setData = function(data) {
		_data = data;
	}
	var getDataPart = function(obj, prop) {

	}
	var resolveData = function(path, obj) {
		var part = path.shift();
		if(obj) {
			if(obj[part]) {
				if(path.length == 0) return obj[part];
				if(obj[part] instanceof Array) {
					if(!obj[part + "___index"]) obj[part + "___index"] = 0;
					return resolveData(path, obj[part][obj[part + "___index"]++]);
				} else {
					return resolveData(path, obj[part]);
				}
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

	// default api definition
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

	// main logic methods
	var comments = [];
	var getComments = function(context) {
		for(var i=0; i<context.length; i++) {
			if(typeof context[i].childNodes !== "undefined" && context[i].childNodes.length > 0) {
				getComments(context[i].childNodes);
			}
			if(context[i].nodeType === 8) {
				var comment = context[i];
				var command = parseCommand(comment.data);
				if(api[command[0]]) {
					var method = command[0];
					var apiCallback = function() {
						getComments(context);
					}
					command.splice(0, 1);
					var args = [apiCallback, comment].concat(command);
					api[method].apply(api, args);
				} else {
					console.log("%cPrototyper.js: Missing api method '" + command[0] + "'", "color: #F00;");
				}
				return;
			}
		}
	}
	var init = function() {
		getComments(document.querySelectorAll("body"));
	}

	return {
		init: init,
		setData: setData
	}

})();

window.onload = function() {
	PR.init();
}
