define([
	"ps2/widget/PlyrWindow",
	"ps2/widget/PlyrWinMin",
	
	"dojo/dnd/Source", 
	"dijit/_Widget", 
	"dijit/_Templated", 
	"dijit/layout/TabContainer", 
	"dijit/layout/ContentPane",
	"dijit/form/Button", 
	"dojo/dom",
	"dojo/text!./FeedBody.html",
], function(
	PlyrWindow,
	PlyrWinMin,
	
	Source, 
	_Widget, 
	_Templated, 
	TabContainer, 
	ContentPane, 
	Button, 
	dom,
	template
){
		
return dojo.declare("ps2.containers.FeedBody", [ dijit._Widget, dijit._Templated ], {

	templateString: template, //dojo.cache("example", "templates/SomeWidget.html"),
	
	//  your custom code goes here
	constructor: function (params) {
		console.log("FeedBody constructor params:", params);
	},
	
	startup: function () {
		console.log("FeedBody startup ");
		
		var tc = new TabContainer({
			style: "height: 100%; width: 100%;",
			doLayout:false
		}, this.tab_container);

		var playerFeedTab = new ContentPane({
			 title: "Feeds",
			 //closable: true,
			 //content: '<div id="player_feed_wall"  style="min-height:400px;"><span id="bounty_feed_wall" class="window" style="min-height:400px;width:350px;"></span><span id="pArr" class="window"></span></div>',
			 content: '<div id="player_feed_wall" class=""  style="height:400px;">feeds</div>',
			 
		});
		tc.addChild(playerFeedTab);

		var OutfitFeedTab = new ContentPane({
			 title: "Settings",
			 //closable: true,
			 content: '<div id="outfit_feed_wall" style="min-height:400px;">TODO: Create Settings Template</div>',
			 onClose: function() {
				OutfitWindow.closeAll();
				return false;
			 }
		});
		tc.addChild(OutfitFeedTab);

		tc.startup();
		
		
		/*var widget = new ps2.widget.PlyrWindow({
			player_id: '5366546354656',
		}, dojo.byId("player_feed_wall") );
		widget.startup();*/
	
		this.addPlyr('ratch');
	},
	
	addPlyr: function (pname) {
		console.log("FeedBody addPlyr ");
		
		// create a dom div for this widget
		var div = dojo.create("div", null, dojo.byId("player_feed_wall"), "first");
		
		var plyr = new PlyrWinMin({
			player_id: '5366546354656',
		}, div );
		plyr.startup();
	
	},
	
});

});