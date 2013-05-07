# Prototyper

Helpful tool for building responsive design html prototypes. It looks like a template engine, but it's not. The main idea behind it was to be much simpler. Most of the similar libraries uses a little bit complex solutions. Also they add a lot of unnecessary markup. In *prototyper* the instructions are set in HTML comments. So even if you remove *prototyper* from your page the markup will look ok.

## Usage

  1. Import *prototyper.js* in your page
  2. Attach event listeners to *prototyper* (if you need  to)
  2. In your bootstrap script call *prototyper.run(DOMElement, data)*

* check the example in */test* directory for better illustration

## Commands

### Including another template
Feel free to use nested templates.

	<body>
		<!-- include templates/header.html -->
	</body>

### Adding external data to the template
*Prototyper* uses [mustache](http://mustache.github.io/)'s similar syntax, so you can convert the html templates easily later.

	prototyper.run(
		document.querySelectorAll("body"),
		{
			title: "Prototyper is really simple",
			menu: [
				{ label: "Home", description: "That's the home page"},
				{ label: "About", description: "More inforomation about us"},
				{ label: "Contacts", description: "Click here to find us"}
			]
		}
	)

then in your html

	<header>
		<h1>{{title}}</h1>
	</header>

or 

	<header>
		<ul>
			<li><a href="#" title="{{menu.description}}">{{menu.label}}</a></li>
			<li><a href="#" title="{{menu.description}}">{{menu.label}}</a></li>
			<li><a href="#" title="{{menu.description}}">{{menu.label}}</a></li>
		</ul>
	</header>

### Events
Currently there is only one event to add listener to - *done*.

	Prototyper.on("done", function() {
		// prototyper finishes its job
	});

## Used resources

  [http://www.w3schools.com/dom/dom_nodetype.asp](http://www.w3schools.com/dom/dom_nodetype.asp)
  [https://github.com/padolsey/commentData/blob/master/commentdata.js](https://github.com/padolsey/commentData/blob/master/commentdata.js)
  [http://james.padolsey.com/javascript/metadata-within-html-comments/](http://james.padolsey.com/javascript/metadata-within-html-comments/)