define([
	
	"dojo/dnd/Source", 
	"dijit/_Widget", 
	"dijit/_Templated", 
	"dijit/layout/TabContainer", 
	"dijit/layout/ContentPane",
	"dijit/form/Button", 
	"dojo/dom",
	"dojo/text!./PlyrWindow.html",
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
		// Summary:
		// Player Window will be a leftpane view that shows a DETAILED
		// killstream of the player entered. This will not have outfit info,
		// instead that will be shown on the OutfitMon pane.
		
	return dojo.declare("ps2.widget.player.PlyrWindow", [ dijit._Widget, dijit._Templated], {

		templateString: template, //dojo.cache("example", "templates/SomeWidget.html"),
		
		//  your custom code goes here
		constructor: function (params) {
			console.log("PlyrWindow constructor params:", params);
		},
		
		startup: function () {
			console.log("PlyrWindow startup ");
		
		},
		
	});

});