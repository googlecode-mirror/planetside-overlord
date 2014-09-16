define([
	
	"dojo/DeferredList",
	"dojo/io/script", 
	"dojo/dom"
], function(
	
	DeferredList,
	Script, 
	dom
){
		
	var MemberApi =  dojo.declare("ps2.containers.MemberApi", null, {

		connection: null,// websock
		outfit_tag_lower: '',
		outfit_id: '',
		outfit_stats: null,
		data: null,
		
		//  your custom code goes here
		constructor: function (params) {
			var self = this;
			console.log("MemberApi constructor params:", params);
			
			if(!params.outfit_tag_lower && !params.outfit_id){
				console.error("MemberApi needs a outfit id or name!");
			}
			
			// Set defaults
			this.outfit_id = (params.outfit_id ? params.outfit_id.toLowerCase() : '');
			this.outfit_tag_lower = (params.outfit_tag_lower ? params.outfit_tag_lower.toLowerCase() : '');
			
			// Set Callbacks
			this.onPlayerEvent = params.onPlayerEvent;
			this.onMembersConnected = params.onMembersConnected;
			this.onComplete = params.onComplete;
			
			dojo.ready(function(){				
				
				// Initial fetchStats
				self.fetchStats();
				
			});//end dojo.ready
		},
		
		
		fetchStats: function () {
			var self = this;
			
			//build identifier
			var identifier = '';
			if( self.outfit_tag_lower != '' && self.outfit_tag_lower != null ) {
				identifier = 'alias_lower=' + self.outfit_tag_lower;
			} else if( self.outfit_id != '' && self.outfit_id != null ) {
				identifier = "outfit_id=" + self.outfit_id;
			}
			
			var url = 'https://census.soe.com/s:rch/get/ps2:v2/outfit/?'
				+ identifier
				+'&c:resolve=member_character(name,type.faction)'
				+'&c:resolve=member_online_status'
				+'&c:resolve=leader';
			self.myGet = Script.get({
				url: url,
				handleAs: 'json',
				//content: content,
				callbackParamName: "callback",
				load: function (data, ioargs) {
					console.log('MemberApi load Plyr io', ioargs);
				}
			}).then(function (data) {
				console.log("MemberApi GET data:", data);
				self.data = data.outfit_list[0];
				//self.setStats(data.character_list[0]);
				self.onComplete(self.data);// Callback
				self.requestWebsock();
			});
		
		},
		
		
		buildPlayerArray: function () {
			var self = this;
			
			var arr = [];
			var count = self.data.member_count;
			
			for(var i = 0; i < count; ++i) {
				arr.push( self.data.members[i].character_id );
			}
			
			//console.log("arr: ", arr);
			return arr;
		
		},
		
		
		requestWebsock: function () {
			var self = this;
			
			this.connection = new WebSocket('wss://push.planetside2.com/streaming?service-id=s:rch');
			
			// When the connection is open, send some data to the server
			this.connection.onopen = function () {
				//console.log("this. connection opened");
				var kill_events = JSON.stringify({
					"service":"event",
					"action":"subscribe",
					"characters": self.buildPlayerArray(),
					"eventNames":[
						"Death",
						"PlayerLogin",
						"PlayerLogout"
						]
				});
				//console.log("kill_events:", kill_events);
				self.connection.send(kill_events);
				self.onMembersConnected();
				//self.updateStatus();
			};

			// Log errors
			this.connection.onerror = function (error) {
			  console.error('WebSocket Error :', error);
			  //$(self.feed_id).html( 'Connection Error! ' + '<br />' + $(self.feed_id).html() );
			};

			// Log kill_streams from the server
			this.connection.onmessage = function (e) {
				var msg = jQuery.parseJSON( e.data );
				if( msg.type != 'serviceStateChanged' ) {
					console.log("msg:", msg);
				}
				if( msg.service == 'event' && msg.type == 'serviceMessage' ) {
					//console.log("event:", msg);
					self.playerEvent( msg.payload );
				}
			};/**/
			
			// check connection status
			this.updater = setInterval( function(){
				console.log("TODO: MemberApi check connection");
				//self.updateStatus();
				//self.updateTotalMembers();
			},20000);
			
		},
		
		// This calls onPlayerEvent callback with additional info:
		//	 weapon stats on 'death' event
		//   character name for both players
		playerEventPacked: function (getResults, event) {
			var self = this;
			
			// set character stats
			if( getResults[0][0] ==  true ) {
				var charData = getResults[0][1];
				console.log("MemberApi GET charData:", charData);
				//sort attacker and player
				if( charData.character_list[0].character_id == event.attacker_character_id ) {
					event['attacker_stats'] = charData.character_list[0];
					event['victim_stats'] = charData.character_list[1];
				} else {
					event['attacker_stats'] = charData.character_list[1];
					event['victim_stats'] = charData.character_list[0];
				}
			}
			
			// set wep stats
			if( getResults[1][0] ==  true ) {
				var wepData = getResults[1][1];
				console.log("MemberApi GET wepData:", wepData);
				event['weapon_stats'] = wepData.item_list[0];	
			}
			
			// set vehicle stats
			if( event.attacker_vehicle_id != '0' && getResults[2][0] ==  true ) {
				var vehData = getResults[2][1];
				console.log("MemberApi GET vehData:", vehData);
				event['vehicle_stats'] = vehData.vehicle_list[0];	
			}


			self.onPlayerEvent(event); 
		},
		
		// Outside callbacks
		playerEvent: function (event) {
			var self = this;
			//console.log("event:", event);
			
			if( this.onPlayerEvent != null ) {
			
				// Check in Death event and get Weapon stats before callback
				if( event.event_name == 'Death' ) {
					var apiCalls = [];
					
					apiCalls.push(this.getCharacterStats(event));
					apiCalls.push(this.getWeaponStats(event));
					
					if( event.attacker_vehicle_id != '0' ) {
						apiCalls.push(this.getVehicleStats(event));
					}
						
					var list = new DeferredList(apiCalls);
					list.then(function(eventPacked) {
						console.log("eventPacked:", eventPacked);
						self.playerEventPacked(eventPacked, event);
					});
				} else {
					// Get info via requests
					this.onPlayerEvent(event);

				}
					
			}
		},
		
		// Api Weapon Info
		getWeaponStats: function (event) {
			var self = this;
			console.log("MemberApi getWeaponStats() event:", event);
			
			var url = 'http://census.soe.com/s:rch/get/ps2:v2/item/'
				+'?item_id='+event.attacker_weapon_id
				+'&c:show=name.en,image_path';
			var wepGet = Script.get({
				url: url,
				handleAs: 'json',
				//content: content,
				callbackParamName: "callback",
				load: function (data, ioargs) {
					//console.log('MemberApi getWeaponStats io', ioargs);
				}
			});
			return wepGet;
		},
		
		// Api Both Character Info
		getCharacterStats: function (event) {
			var self = this;
			console.log("MemberApi getCharacterStats() event:", event);
			
			var url = 'http://census.soe.com/s:rch/get/ps2:v2/character/'
			+'?character_id='+ event.attacker_character_id + ','
			+event.character_id
			+'&c:resolve=outfit_member_extended';
			var charGet = Script.get({
				url: url,
				handleAs: 'json',
				//content: content,
				callbackParamName: "callback",
				load: function (data, ioargs) {
					console.log('MemberApi getCharacterStats io', ioargs);
				}
			});
			return charGet;
		},
		
		// Api Both Character Info
		getVehicleStats: function (event) {
			var self = this;
			console.log("MemberApi getVehicleStats() event:", event);
			
			var url = 'http://census.soe.com/s:rch/get/ps2:v2/vehicle?'
			+'vehicle_id=' + event.attacker_vehicle_id
			+'&c:show=name.en,cost,image_path,vehicle_id';
			var vehGet = Script.get({
				url: url,
				handleAs: 'json',
				//content: content,
				callbackParamName: "callback",
				load: function (data, ioargs) {
					console.log('MemberApi getCharacterStats io', ioargs);
				}
			});
			return vehGet;
		},
		
	});
	

	return MemberApi;
});