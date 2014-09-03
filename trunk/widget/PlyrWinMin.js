define([
	"dojo/dnd/Source", 
	"dijit/_Widget", 
	"dijit/_Templated", 
	"dijit/layout/TabContainer", 
	"dijit/layout/ContentPane",
	"dijit/form/Button", 
	"dojo/dom",
	"dojo/text!./PlyrWinMin.html",
], function(
	Source, 
	_Widget, 
	_Templated, 
	TabContainer, 
	ContentPane, 
	Button, 
	dom,
	template
){
		
	return dojo.declare("ps2.widget.PlyrWinMin", [ dijit._Widget, dijit._Templated ], {

		templateString: template, //dojo.cache("example", "templates/SomeWidget.html"),
		
		//  your custom code goes here
		constructor: function (params) {
			console.log("PlyrWinMin constructor params:", params);
			console.log("PlyrWinMin baseClass :", this.baseClass);
		},
		
		startup: function () {
			console.log("PlyrWinMin startup ");
			console.log("PlyrWinMin baseClass :", this.baseClass);
		
		},
		
	});

});