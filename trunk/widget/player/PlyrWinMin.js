define([
	"ps2/widget/player/PlyrKillQue", 
	
	"dojo/dnd/Source", 
	"dojo/io/script", 
	"dijit/_Widget", 
	"dijit/_Templated", 
	"dijit/layout/ContentPane",
	"dijit/form/Button", 
	"dojo/dom",
	"dojo/text!./PlyrWinMin.html",
], function(
	PlyrKillQue, 
	
	Source, 
	Script, 
	_Widget, 
	_Templated, 
	ContentPane, 
	Button, 
	dom,
	template
){

	// Constructor can be passed two basic options for player identity 
	//		(must have at least one!)
	// 		player_name:
	// 		player_id:
	// player_stats: Pass object with the player stats, otherwise this will make api call
	// useWebsock = Pass true if you want this to handle the websocket for you
		
	var PlyrWinMin =  dojo.declare("ps2.widget.player.PlyrWinMin", [ _Widget, _Templated ], {

		templateString: template, //dojo.cache("example", "templates/SomeWidget.html"),
		widgetsInTemplate: true,
		connection: null,// websock
		player_name: '',// lowercase
		player_id: '',
		player_stats: null,
		longPoll: null,
		
		//  your custom code goes here
		constructor: function (params) {
			console.log("PlyrWinMin constructor params:", params);
			if( (!params.player_id/* == null || params.player_id == ''*/)
				&& (!params.player_name/* == null || params.player_name == ''*/)	){
				console.error("PlyWinMin needs a player id or name!");
			}
			
			// Set defaults
			this.player_id = (params.player_id ? params.player_id.toLowerCase() : '');
			this.player_name = (params.player_name ? params.player_name.toLowerCase() : '');
			this.player_stats = (params.player_stats ? params.player_stats : false);
			this.useWebsock = (params.useWebsock ? params.useWebsock : false);
			
			
		},
		
		startup: function () {
			var self = this;
			console.log("PlyrWinMin startup ");
		
			
			dojo.ready(function(){				
				
				// Initial fetchStats
				if( self.player_stats == false ) {
					self.fetchStats();
				} else {
					self.setStats(data.character_list[0]);
					self.finishedLoad();
				}
				
			});//end dojo.ready
			
		},
		
		fetchStats: function () {
			var self = this;
			
			//build content
			var content = {};
			if( self.player_name != '' && self.player_name != null ) {
				content["name.first_lower"] = self.player_name;
			} else if( self.player_id != '' && self.player_id != null ) {
				content["character_id"] = self.player_id;
			}
			content["c:resolve"] = "online_status";
			
			
			self.myGet = Script.get({
				url: 'http://census.soe.com/s:rch/get/ps2/character/',
				handleAs: 'json',
				content: content,
				callbackParamName: "callback",
				load: function (data, ioargs) {
					//console.log('load Plyr io', ioargs);
				}
			}).then(function (data) {
				console.log("PlyrWinMin GET data:", data);
				self.setStats(data.character_list[0]);
				self.finishedLoad();
			});
		
		},
		
		setStats: function(character_data) {
			
			// set player name
			this.player_name = character_data.name.first_lower;
			this.p_que.player_name = character_data.name.first_lower;
			this.p_name.innerHTML = character_data.name.first;
			
			// set player id
			this.player_id = character_data.character_id;
			this.p_que.player_id = character_data.character_id;
			
			// set player BR 
			this.p_br.innerHTML = ((character_data.battle_rank.value.length > 2 ) ? "BR " : "BR  ") + character_data.battle_rank.value;
			
			this.player_stats = character_data;
		},
		
		finishedLoad: function () {
			var self = this;
			
			dojo.style(this.p_body, {
				"display": "block"
			});
			
			if( self.useWebsock ) {
				self.requestWebsock();
			}
			
			//self.startLongPoll();
			
			// test stuff here
			/*setTimeout(function () {
				self.p_que.pushEvent('77');
					setTimeout(function () {
						self.p_que.pushEvent('88');
							setTimeout(function () {
								self.p_que.pushEvent('87');
									setTimeout(function () {
										self.p_que.pushEvent('11');
											setTimeout(function () {
												self.p_que.pushEvent('100');
												setTimeout(function () {
													self.p_que.pushEvent('99');
													setTimeout(function () {
														self.p_que.pushEvent('98');
														setTimeout(function () {
															self.p_que.pushEvent('97');
														}, 1000);
													}, 1000);
												}, 1000);
											}, 1000);
									}, 1000);
							}, 1000);
					}, 1000);
			}, 1000);*/
		},
		
		finishedUpdate: function () {
		
		},
		
		// ONLY USED when useWebsock is true
		requestWebsock: function () {
			var self = this;
			
			this.connection = new WebSocket('wss://push.planetside2.com/streaming?service-id=s:rch');
			
			// When the connection is open, send some data to the server
			this.connection.onopen = function () {
				//console.log("this. connection opened");
				var kill_events = '{"service":"event","action":"subscribe","characters":["' + self.player_id + '"],"eventNames":["Death","PlayerLogin","PlayerLogout"]}';
				console.log("kill_events:", kill_events);
				self.connection.send(kill_events);
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
					//console.log("msg:", msg);
				}
				if( msg.service == 'event' && msg.type == 'serviceMessage' ) {
					//console.log("event:", msg);
					self.p_que.pushEvent( msg.payload );
				}
			};/**/
			
			// check connection status
			this.updater = setInterval( function(){
				console.log("TODO: check connection");
				//self.updateStatus();
				//self.updateTotalMembers();
			},20000);
			
		},
		
		playerEvent: function (event) {
		
			this.p_que.pushEvent( event );
			this.handleEvent(event);
		},
		
		handleEvent: function (event) {
			console.log("handleEvent img event:", event);
			if( event.weapon_stats != null && event.weapon_stats.image_path != null ) {
			
				var src = "url('http://census.soe.com" + event.weapon_stats.image_path + "')";
				
				dojo.style(this.p_gallery, {
					"backgroundImage": src,
				});
				
				console.log("handleEvent img:",src);
			}
		},
		
		closeThis: function () {
			console.log("closeThis: ", this.player_stats.name.first);
			
			if( this.longPoll ) {
				clearInterval(this.longPoll);
			}
			
			if( this.useWebsock ) {
				
				this.connection.close();
			}
			this.destroy();
		},
		
		startLongPoll: function () {
			var self = this;
			var url = 'http://census.soe.com/s:rch/get/ps2:v2/character/'
				+'?character_id='+self.player_id
				+'&c:resolve=currency';
			console.log("startLongPoll: URL:", url);

			this.longPoll = setInterval(function(){
				console.log("PlyrWinMin GET POLL:");
			
				self.pollGet = Script.get({
					url: url,
					handleAs: 'json',
					//content: content,
					callbackParamName: "callback",
					load: function (data, ioargs) {
						//console.log('load Plyr io', ioargs);
					}
				}).then(function (data) {
					console.log("PlyrWinMin GOT POLL:", data);
					self.p_face.innerHTML = '$'+data.character_list[0].currency.quantity;
				});
			}, 30000);	
				/**/
		},
		
	});
	
	dojo.mixin(PlyrWinMin, {create: function (params, container) {
		if( !params.player_id && !params.player_name ){
			console.error("PlyWinMin needs a player id or name!");
			return false;
		}
		// create a dom div for this widget
		var div = dojo.create("div", null, container, "last");
		
		var plyr = new PlyrWinMin(params, div );
		plyr.startup();
		return plyr;
	}});

	return PlyrWinMin;
});