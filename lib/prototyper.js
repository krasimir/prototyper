// http://www.w3schools.com/dom/dom_nodetype.asp
// https://github.com/padolsey/commentData/blob/master/commentdata.js
// http://james.padolsey.com/javascript/metadata-within-html-comments/

var PrototyperJS = (function() {

	// helper command parsing methods
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
	api.include = function(comment, file, times) {
		if(typeof file !== "undefined") {
			getFile(file, function(content) {
				
			});
		}
	}

	// main logic methods
	var comments = [];
	var getComments = function(context) {
		for(var i=0; i<context.length; i++) {
			if(typeof context[i].childNodes !== "undefined" && context[i].childNodes.length > 0) {
				getComments(context[i].childNodes);
			}
			if(context[i].nodeType === 8) {
				comments.push({
					node: context[i]
				});
			}
		}
	}
	var processComments = function() {
		for(var i=0; i<comments.length; i++) {
			var comment = comments[i];
			var command = parseCommand(comment.node.data);
			if(api[command[0]]) {
				var method = command[0];
				command.splice(0, 1);
				api[method].apply(api, [comment].concat(command));
			} else {
				console.log("%cPrototyper.js: Missing api method '" + command[0] + "'", "color: #F00;");
			}
		}
	}
	var init = function() {
		getComments(document.querySelectorAll("body"));
		processComments();
	}

	return {
		init: init
	}

})();

window.onload = function() {
	PrototyperJS.init();
}
