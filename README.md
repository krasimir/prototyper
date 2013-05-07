# Prototyper

Helpful tool for building responsive design html prototypes. It looks like a template engine, but it's not. The main idea behind it was to be much simpler. Most of the similar libraries uses a little bit complex solutions. Also they add a lot of unnecessary markup. In *prototyper* the instructions are set in HTML comments. So even if you remove *prototyper* from your page the markup will look ok.

## Usage

  1. Import *prototyper.js* in your page
  2. Add data or/and attach event listeners to *Prototyper* 
  2. In your bootstrap script call *Prototyper.run()*

* check the example in */test* directory for better illustration

## Commands

### Including another template
Feel free to use nested templates.

	<body>
		<!-- include templates/header.html -->
	</body>

### Adding external data to the template

	<script type="text/javascript">
		Prototyper.setData({
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

### Events
Currently there is only one event to add listener to - *done*.

	Prototyper.on("done", function() {
		// prototyper finishes its job
	});

## Used resources

  [http://www.w3schools.com/dom/dom_nodetype.asp](http://www.w3schools.com/dom/dom_nodetype.asp)
  [https://github.com/padolsey/commentData/blob/master/commentdata.js](https://github.com/padolsey/commentData/blob/master/commentdata.js)
  [http://james.padolsey.com/javascript/metadata-within-html-comments/](http://james.padolsey.com/javascript/metadata-within-html-comments/)