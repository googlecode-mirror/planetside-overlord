require([
	"ps2/widget/PlyrWindow",
	
	"dojo/dnd/Source", 
	"dijit/_Widget", 
	"dijit/_Templated", 
	"dijit/layout/TabContainer", 
	"dijit/layout/ContentPane",
	"dijit/form/Button", 
	"dojo/dom",
	"dojo/text!./containers/FeedBody.html",
], function(
	PlyrWindow,
	
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
			 content: '<div id="player_feed_wall" class="" dojoType="dojo.dnd.Source"  style="min-height:400px;"></div>',
			 onClose: function() {
				PlayerWindow.closeAll();
				return false;
			 }
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
	
	},
	
});

});