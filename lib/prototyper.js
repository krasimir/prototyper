// http://www.w3schools.com/dom/dom_nodetype.asp
// https://github.com/padolsey/commentData/blob/master/commentdata.js
// http://james.padolsey.com/javascript/metadata-within-html-comments/
// window.onload = function() {
	var getComments = function(context) {
		for(var i=0; i<context.length; i++) {
			if(typeof context[i].childNodes !== "undefined" && context[i].childNodes.length > 0) {
				getComments(context[i].childNodes);
			}
			if(context[i].nodeType === 8) {
				// context[i].data
			}
		}
	}
	getComments(document.querySelectorAll("body"));
// }

var PrototyperJS = (function() {

	var api = {};
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
	var proccessCommand = function(data) {

	}
	var processComments = function() {
		for(var i=0; i<comments.length; i++) {
			var comment = comments[i];
			var command = proccessCommand(comment.node.data);
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
