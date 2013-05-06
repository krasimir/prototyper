prototyper.js
==========

Helpful tool for building responsive design html prototypes. It looks like a template engine, but it's not. The main idea behind it was to be super simple and fast. Most of the similar libraries uses a little bit complex solutions for such a simple task. Also they add a lot of unnecessary markup. In *prototyper* the instructions are set in HTML comments. So even if you remove *prototyper* your markup will look ok.

## Features

### Including another template

	<body>
		<!-- include templates/header.html -->
	</body>

### Adding predefined data

	<script type="text/javascript">
		PR.setData({
			title: "Prototyper is really simple",
			menu: [
				{ label: "Home"},
				{ label: "About"},
				{ label: "Contacts"}
			]
		})
	</script>

then in your html

	<header>
		<h1><!-- data title --></h1>
	</header>

or 

	<header>
		<ul>
			<li><a href="#"><!-- data menu.label --></a></li>
			<li><a href="#"><!-- data menu.label --></a></li>
			<li><a href="#"><!-- data menu.label --></a></li>
		</ul>
	</header>


## Development sources

[http://www.w3schools.com/dom/dom_nodetype.asp](http://www.w3schools.com/dom/dom_nodetype.asp)
[https://github.com/padolsey/commentData/blob/master/commentdata.js](https://github.com/padolsey/commentData/blob/master/commentdata.js)
[http://james.padolsey.com/javascript/metadata-within-html-comments/](http://james.padolsey.com/javascript/metadata-within-html-comments/)