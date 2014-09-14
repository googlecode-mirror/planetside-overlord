define([
	"ps2/widget/player/PlyrWindow",
	"ps2/widget/outfit/OutfitMon",
	
	"dojo/io/script", 
	"dojo/dnd/Source", 
	"dijit/_Widget", 
	"dijit/_Templated", 
	"dijit/layout/TabContainer", 
	"dijit/layout/ContentPane",
	"dijit/form/Button", 
	"dojo/dom",
	"dojo/text!./FeedBody.html",
	"dojo/text!./FeedTab.html",
], function(
	PlyrWindow,
	OutfitMon,
	
	Script, 
	Source, 
	_Widget, 
	_Templated, 
	TabContainer, 
	ContentPane, 
	Button, 
	dom,
	FeedBodyTemplate,
	FeedTabTemplate
){
		
return dojo.declare("ps2.containers.FeedBody", [ dijit._Widget, dijit._Templated ], {

	templateString: FeedBodyTemplate, //dojo.cache("example", "templates/SomeWidget.html"),
	widgetsInTemplate: true,
	
	//  your custom code goes here
	constructor: function (params) {
		console.log("FeedBody constructor params:", params);
	},
	
	startup: function () {
		console.log("FeedBody startup ");
		
		var tc = new TabContainer({
			style: "height: 100%; width: 100%; padding:0px; border:0px;",
			doLayout:false
		}, this.tab_container);

		var playerFeedTab = new ContentPane({
			 title: "Feeds",
			 style: "padding:0px;",
			 //closable: true,
			 //content: '<div id="player_feed_wall"  style="min-height:400px;"><span id="bounty_feed_wall" class="window" style="min-height:400px;width:350px;"></span><span id="pArr" class="window"></span></div>',
			 //content: '<div id="feed_main_div" class=""  style="height:400px;"></div>',
			 content: FeedTabTemplate,
			 
		});
		tc.addChild(playerFeedTab);

		var SettingsTab = new ContentPane({
			 title: "Settings",
			 //closable: true,
			 content: '<div id="settings_tab" style="min-height:200px;">TODO: Create Settings Template</div>',
			 onClose: function() {
				OutfitWindow.closeAll();
				return false;
			 }
		});
		tc.addChild(SettingsTab);

		tc.startup();
		
		
		/*var widget = new ps2.widget.player.PlyrWindow({
			player_id: '5366546354656',
		}, dojo.byId("player_feed_wall") );
		widget.startup();*/
	
		//this.addPlyr({ player_name: 'ratch'});
		//this.addPlyr('Okamiba');
		this.addOutfit('merc');
	},
	
	addOutfit: function (tag_lower) {
		var self = this;
		console.log("FeedBody addOutfit:", tag_lower);
		
		var outfit = OutfitMon.create({
			outfit_tag_lower: tag_lower 
		}, 'feed_main_div');
	},
	
	// params can contain player_id or player_name or both
	addPlyr: function (params) {
		console.log("FeedBody addPlyr:", params);
		
		var plyr = PlyrWinMin.create(params);
	
	},
	
	addMultiplePlyrs: function (members) {
		console.log("FeedBody addMultiplePlyrs:", members[0]);
		
		var count = 50;
		if( members.length < count ) { 
			count = members.length; 
		}
		
		for(var i = 0; i < members.length; ++i) {
			console.log("loop online:", members[i].online_status);
			if( members[i].online_status != '0' ) {
				console.log("loop 1");
				this.addPlyr({
					//player_name: members[i].name.first_lower,
					player_id: members[i].character_id,
				});
				count--;
			}
			if( count <= 0 ) {
				break;
			}
		}
	
	},
	
	addOutfitClick: function () {
		var self = this;
		console.log("FeedBody addOutfitClick:");
		this.addOutfit(this.tag_input.value);
	},
	
});

});