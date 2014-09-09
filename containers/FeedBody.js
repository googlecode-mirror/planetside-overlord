define([
	"ps2/widget/PlyrWindow",
	"ps2/widget/PlyrWinMin",
	
	"dojo/io/script", 
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
	
	Script, 
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
	
		//this.addPlyr('ratch');
		//this.addPlyr('Okamiba');
		this.addOutfit('aod');
	},
	
	addOutfit: function (tag) {
		var self = this;
		console.log("FeedBody addOutfit:", tag);
		
		var getOutfit = Script.get({
			url: 'https://census.soe.com/s:rch/get/ps2:v2/outfit/'
				+"?alias_lower="+tag.toLowerCase()
				+"&c:resolve=member_character(name)"
				+"&c:resolve=member_online_status"
				+"&c:resolve=leader",
			handleAs: 'text',
			content: {
				/*"alias_lower" : tag,
				"c:resolve": "member_character(name)",
				"c:resolve": "member_online_status",
				"c:resolve": "leader"*/
			},
			callbackParamName: "callback",
			load: function (data, ioargs) {
				//console.log("load addOutfit data:", data, 'io:', ioargs);
			}
		}).then(function (data, ioargs) {
			console.log("addOutfit data:", data);
			if( data.outfit_list[0] != null ) {
				self.addMultiplePlyrs(data.outfit_list[0].members);
			} else {
				console.warn("data.outfit_list[0] is null!");
			}
		});
	
	},
	
	// params can contain player_id or player_name or both
	addPlyr: function (params) {
		console.log("FeedBody addPlyr:", params);
		
		// create a dom div for this widget
		//var div = dojo.create("div", null, dojo.byId("player_feed_wall"), "first");
		
		//var plyr = new PlyrWinMin(params, div );
		var plyr = PlyrWinMin.create(params);
		//plyr.startup();
	
	},
	
	addMultiplePlyrs: function (members) {
		console.log("FeedBody addMultiplePlyrs:", members[0]);
		
		var count = 99;
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
	
});

});