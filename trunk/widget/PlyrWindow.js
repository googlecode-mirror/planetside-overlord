require([
	"dijit/_Widget", 
	"dijit/_Templated", 
	"dijit/layout/TabContainer", 
	"dijit/layout/ContentPane",
	"dijit/form/Button", 
	"dojo/dom",
	"dojo/text!./widget/PlyrWindow.html",
], function(
	_Widget, 
	_Templated, 
	TabContainer, 
	ContentPane, 
	Button, 
	dom,
	template
){
		
	return dojo.declare("ps2.widget.PlyrWidget", [ dijit._Widget, dijit._Templated ], {

		templateString: template, //dojo.cache("example", "templates/SomeWidget.html"),
		
		//  your custom code goes here
		constructor: function (params) {
			console.log("PlyrWindow constructor params:", params);
			console.log("PlyrWindow baseClass :", this.baseClass);
		},
		
		startup: function () {
			console.log("PlyrWindow startup ");
			console.log("PlyrWindow baseClass :", this.baseClass);
		
		},
		
	});

});