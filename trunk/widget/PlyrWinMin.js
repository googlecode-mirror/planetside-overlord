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
		
	var PlyrWinMin =  dojo.declare("ps2.widget.PlyrWinMin", [ _Widget, _Templated ], {

		templateString: template, //dojo.cache("example", "templates/SomeWidget.html"),
		widgetsInTemplate: true,
		connection: null,// websock
		player_name: '',// lowercase
		player_id: '',
		player_stats: null,
		
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
			
		},
		
		startup: function () {
			var self = this;
			console.log("PlyrWinMin startup ");
		
			
			dojo.ready(function(){				
				
				// Initial fetchStats
				self.fetchStats();
				
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
					console.log('load Plyr io', ioargs);
				}
			}).then(function (data) {
				console.log("then data:", data);
				self.setStats(data.character_list[0]);
				self.finishedLoad();
				self.requestWebsock();
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
			},2000);
			
		},
		
	});
	
	dojo.mixin(PlyrWinMin, {create: function (params) {
		if( !params.player_id && !params.player_name ){
			console.error("PlyWinMin needs a player id or name!");
			return false;
		}
		// create a dom div for this widget
		var div = dojo.create("div", null, dojo.byId("player_feed_wall"), "last");
		
		var plyr = new PlyrWinMin(params, div );
		plyr.startup();
		return plyr;
	}});

	return PlyrWinMin;
});