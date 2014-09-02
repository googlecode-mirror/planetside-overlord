require([
	"dojo/dnd/Source", 
	"dijit/_Widget", 
	"dijit/_Templated", 
	"dijit/layout/TabContainer", 
	"dijit/layout/ContentPane",
	"dijit/form/Button", 
	"dojo/dom",
	"dojo/text!./containers/FeedHeader.html",
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
		
	return dojo.declare("ps2.containers.FeedHeader", [ dijit._Widget, dijit._Templated ], {

		templateString: template, //dojo.cache("example", "templates/SomeWidget.html"),
		
		//  your custom code goes here
		constructor: function (params) {
			console.log("FeedHeader constructor params:", params);
		},
		
		startup: function () {
			console.log("FeedHeader startup ");
		
		},
		
	});

});