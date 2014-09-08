define([
	"dojo/dnd/Source", 
	"dijit/_Widget", 
	"dijit/_Templated", 
	"dijit/layout/ContentPane",
	"dijit/form/Button", 
	"dojo/dom",
	"dojo/text!./FeedFooter.html",
], function(
	Source, 
	_Widget, 
	_Templated, 
	ContentPane, 
	Button, 
	dom,
	template
){
		
	return dojo.declare("ps2.containers.FeedFooter", [ _Widget, _Templated ], {

		templateString: template, //dojo.cache("example", "templates/SomeWidget.html"),
		
		//  your custom code goes here
		constructor: function (params) {
			console.log("FeedFooter constructor params:", params);
		},
		
		startup: function () {
			console.log("FeedFooter startup ");
		
		},
		
	});

});