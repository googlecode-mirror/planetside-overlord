define([
	"ps2/widget/player/PlyrWindow",
	"ps2/widget/player/PlyrWinMin", 
	"ps2/containers/MemberApi", 
	
	//"dojo/dnd/Source", 
	//"dojo/io/script", 
	"dijit/form/TextBox",
	"dijit/_Widget", 
	"dijit/_Templated", 
	//"dijit/layout/ContentPane",
	"dijit/form/Button", 
	"dojo/dom",
	"dojo/text!./OutfitMon.html",
], function(
	PlyrWindow, 
	PlyrWinMin, 
	MemberApi, 
	
	//Source, 
	//Script, 
	TextBox, 
	_Widget, 
	_Templated, 
	//ContentPane, 
	Button, 
	dom,
	template
){
		
	var OutfitMon =  dojo.declare("ps2.widget.outfit.OutfitMon", [ _Widget, _Templated ], {

		templateString: template,
		widgetsInTemplate: true,
		connection: null,// websock
		outfit_tag_lower: '',
		outfit_id: '',
		outfit_stats: null,
		members: null,
		
		PlyrWinMinContainer: {},
		PlyrWindow: null,// left pane view
		
		//  your custom code goes here
		constructor: function (params) {
			console.log("OutfitMon constructor params:", params);
			if(!params.outfit_tag_lower && !params.outfit_id){
				console.error("OutfitMon needs a outfit id or name!");
			}
			
			// Set defaults
			this.outfit_id = (params.outfit_id ? params.outfit_id.toLowerCase() : '');
			this.outfit_tag_lower = (params.outfit_tag_lower ? params.outfit_tag_lower.toLowerCase() : '');
			
			
		},
		
		startup: function () {
			var self = this;
			console.log("OutfitMon startup ");
		
			
			dojo.ready(function(){
				
				// Initial fetchStats
				self.members = new MemberApi({
					outfit_tag_lower: self.outfit_tag_lower,
					outfit_id: self.outfit_id, 
					// Callbacks
					onComplete: function (data) { self.onMembersComplete(data) },
					onMembersConnected: function () { self.onMembersConnected() },
					onPlayerEvent: function (event) { self.handlePlayerEvent(event) },
				});
				
			});//end dojo.ready
			
		},
		
		
		setPlyrWindow: function(player_name) {
			if( this.PlyrWindow ) {
				console.error("PlyrWindow already exists!, can't add ", player_name);
			} else {
				this.PlyrWindow = PlyrWinMin.create({
					player_name: player_name,
				}, this.player_feed);
			}
		},
		
		
		setStats: function(outfit_data) {
			
			// set name
			this.outfit_tag_lower = character_data.name.first_lower;
			this.p_que.outfit_tag_lower = character_data.name.first_lower;
			this.p_name.innerHTML = character_data.name.first;
			
			// set id
			this.outfit_id = character_data.character_id;
			this.p_que.outfit_id = character_data.character_id;
			
			this.outfit_stats = outfit_data;
		},
		
		createMembers: function (membersArray) {
			var self = this;
			//console.log("OutfitMon createmembers() membersArray:", membersArray);
			
			for( var i = 0; i < membersArray.length; ++i) {
				if( membersArray[i].online_status != '0' ) {
				
					console.log("Add plyr:", membersArray[i].name.first);
					
					var id = membersArray[i].character_id;
					self.PlyrWinMinContainer[id] = PlyrWinMin.create({
						player_id: id,
						//player_stats: adfs
					}, self.body);
					
				}
			}
		},
		
		
		onMembersComplete: function (data) {
			var self = this;
			console.log("OutfitMon onMembersComplete() data:", data);
			
			//dojo.style(this.p_body, {"display": "block"	});
			self.createMembers(data.members);
		},
		
		onMembersConnected: function (data) {
			var self = this;
			console.log("OutfitMon onMembersConnected() data:", data);
			
			//dojo.style(this.p_body, {"display": "block"	});
			
		},
		
		handlePlayerEvent: function (event) {
			var self = this;
			console.log("OutfitMon handlePlayerEvent() event:", event);
			
			switch( event.event_name ) {
				case "Death":
					self.handlePlayerKillEvent(event);
					break;
				case "PlayerLogin":
					self.handlePlayerLoginEvent(event);
					break;
				case "PlayerLogout":
					self.handlePlayerLogoutEvent(event);
					break;
			} 
		},
		
		handlePlayerKillEvent: function (event) {
			var self = this;
			var attacker = event.attacker_character_id;
			var victim = event.character_id;
			
			if( self.PlyrWinMinContainer[attacker] ) {
				self.PlyrWinMinContainer[attacker].playerEvent(event);
			} else if( self.PlyrWinMinContainer[victim] ) {
				self.PlyrWinMinContainer[victim].playerEvent(event);
			} else {
				console.error("Error handling player event, not in PlyrWinMinContainer event: ", event);
			}
			
		},
		
		handlePlayerLoginEvent: function (event) {
				
			var id = event.character_id;
			this.PlyrWinMinContainer[id] = PlyrWinMin.create({
				player_id: id,
				//player_stats: adfs
			}, this.body);
			
		},
		
		handlePlayerLogoutEvent: function (event) {
			
			var id = event.character_id;
			if( this.PlyrWinMinContainer[id] != null ) {
				this.PlyrWinMinContainer[id].closeThis();
			} else {
				console.error("Player logged out that doesn't have a PlyrWinMin:", id);
			}  
		},
		
		
		
	});
	
	dojo.mixin(OutfitMon, {create: function (params, container) {
		if( !params.outfit_id && !params.outfit_tag_lower ){
			console.error("OutfitMon create() params needs a outfit id or name!");
			return false;
		}
		// create a dom div for this widget
		var div = dojo.create("div", null, container, "last");
		
		var outfit = new OutfitMon(params, div );
		outfit.startup();
		return outfit;
	}});

	return OutfitMon;
});