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
		
		/*var tc = new TabContainer({
			//style: "height: 100%; width: 100%; padding:0px; border:0px;",
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

		tc.startup();*/
		
		
		/*var widget = new ps2.widget.player.PlyrWindow({
			player_id: '5366546354656',
		}, dojo.byId("player_feed_wall") );
		widget.startup();*/
	
		//this.addPlyr({ player_name: 'ratch'});
		//this.addPlyr('Okamiba');
		//this.addOutfit('m3rx');
		this.addOutfit('merc');
		//this.addOutfit('baid');
		//this.addOutfit('666');
		//this.startScan('merc');
	},
	
	addOutfit: function (tag_lower) {
		var self = this;
		console.log("FeedBody addOutfit:", tag_lower);
			
		var outfit = OutfitMon.create({
			outfit_tag_lower: tag_lower,
			
		}, this.feed_body);
		
		if( tag_lower == 'merc' ) {
			//outfit.setPlyrWindow('ratch');
		}
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
	
	// **************** OUTFIT VIRUS ******************
	// 
	// Checks each player event for that players outfit
	// if it doesn't exist in this.allOutfits['outfit']
	// then it creates an OutfitMon
	
	allOutfits: {},
	addOutfitVirus: function (tag_lower) {
		var self = this;
		console.log("FeedBody addOutfit:", tag_lower);
			
		if( this.allOutfits[tag_lower] == null ) {
			var outfit = OutfitMon.create({
				outfit_tag_lower: tag_lower,
				onKillEvent: function (event) {
					var out = outfit;
					//console.log("FeedBody onKillEvent["+out.outfit_tag_lower+"]:", event);
					self.checkOutfit(event.victim_stats, event);
				},
				onDeathEvent: function (event) {
					var out = outfit;
					//console.log("FeedBody onDeathEvent["+out.outfit_tag_lower+"]:", event);
					self.checkOutfit(event.attacker_stats, event);
				},
			}, this.feed_body);
			this.allOutfits[tag_lower] = outfit;
			if( tag_lower == 'merc' ) {
				//outfit.setPlyrWindow('ratch');
			}
		}
	},
	
	checkOutfit: function (enemy_stats, event) {
		//console.log("FeedBody checkOutfit:", enemy_stats);
		if( enemy_stats != null && enemy_stats.outfit_member != null ) {
			var tag = enemy_stats.outfit_member.alias_lower;
			this.addOutfitVirus(tag);
			this.printDebug();
		} else {// tk causes issue here
			//console.warn("FeedBody checkOutfit:", event);
		}
	},
	
	printDebug: function () {
		console.log("FeedBody printDebug");
		
		var debug = dojo.byId('debug_left_pane');
		debug.innerHTML = '';
		
		for(var tag in this.allOutfits) {
			if( this.allOutfits.hasOwnProperty( tag ) ) {
				//console.log("FeedBody printDebug2",this.allOutfits[tag].members);
				
				// THIS LINE GETS ERROR ON .members is undefined
				var str = '['+tag+'] '+this.allOutfits[tag].members.onlineCount;
				
				debug.innerHTML = debug.innerHTML + '<br>' + str;
			}
		}
	},
	
	
	
	// **************** SCANNER ******************
	// Starts looking for all online players
	// First gets outfits with member count above a certain threshhold
	// Then counts the number of online players
	allOutfits: {},
	startScan: function (tag_lower) {
		var self = this;
		console.log("FeedBody addOutfitClick:");
		
		
		self.myGet = Script.get({
			url: 'http://census.soe.com/s:rch/get/ps2:v2/outfit'
			+'?member_count=]'+50
			+'&c:limit=2000'
			+'&c:resolve=member_online_status()',
			handleAs: 'json',
			callbackParamName: "callback",
		}).then(function (data) {
			console.log("startScan GET :", data);
			console.log("startScan GET num outfits:", data.outfit_list.length);
			
			var totalOnline = 0;
			for( var i = 0; i < data.outfit_list.length; ++i ) {
				if( data.outfit_list[i].members != null ) {
					totalOnline += self.getOnlineCount(data.outfit_list[i].members);
				} else {
					console.warn("startScan GET NO MEMBERS for :", data.outfit_list[i]);
				}
			}
			console.log("startScan GET total:", totalOnline);
		});
		
		// create outfit and put into allOutfits
		/*self.allOutfits[tag_lower.toLowerCase()] = OutfitMon.create({
			outfit_tag_lower: tag_lower.toLowerCase(),
			onComplete: function (data) {
				console.log("Outfit onComplete:", data.alias, "data", data);
				
			}
		}, this.feed_body);*/
	},
	
	
	getOnlineCount: function (members) {
		var self = this;
		var count = 0;
	
		
		for(var i = 0; i < members.length; ++i) {
			//console.log('for', members[i]);
			
			if( members[i].online_status != '0' ) {
				count++;
			}
		}
		return count;
	},
	
});

});