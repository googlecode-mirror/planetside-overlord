define([
	"ps2/widget/PlyrWinMin", 
	
	"dojo/dnd/Source", 
	"dojo/io/script", 
	"dijit/_Widget", 
	"dijit/_Templated", 
	"dijit/layout/ContentPane",
	"dijit/form/Button", 
	"dojo/dom",
	"dojo/text!./OutfitMon.html",
], function(
	PlyrWinMin, 
	
	Source, 
	Script, 
	_Widget, 
	_Templated, 
	ContentPane, 
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
				//self.fetchStats();
				
			});//end dojo.ready
			
		},
		
		fetchStats: function () {
			var self = this;
			
			//build content
			var content = {};
			if( self.outfit_tag_lower != '' && self.outfit_tag_lower != null ) {
				content["name.first_lower"] = self.outfit_tag_lower;
			} else if( self.outfit_id != '' && self.outfit_id != null ) {
				content["character_id"] = self.outfit_id;
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
				//self.setStats(data.character_list[0]);
				//self.finishedLoad();
				//self.requestWebsock();
			});
		
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
		
		finishedLoad: function () {
			var self = this;
			
			dojo.style(this.p_body, {
				"display": "block"
			});
		},
		
		finishedUpdate: function () {
		
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
					"characters":[ "ratch"],
					"eventNames":[
						"Death",
						"PlayerLogin",
						"PlayerLogout"
						]
				});
					//'{"service":"event","action":"subscribe","characters":["' + self.outfit_id + '"],"eventNames":["Death","PlayerLogin","PlayerLogout"]}';
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
	
	dojo.mixin(OutfitMon, {create: function (params) {
		if( !params.outfit_id && !params.outfit_tag_lower ){
			console.error("OutfitMon create() params needs a outfit id or name!");
			return false;
		}
		// create a dom div for this widget
		//var div = dojo.create("div", null, dojo.byId("outfit_feed_wall"), "last");
		
		var outfit = new OutfitMon(params, div );
		outfit.startup();
		return outfit;
	}});

	return OutfitMon;
});