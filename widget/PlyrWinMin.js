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
	script, 
	_Widget, 
	_Templated, 
	ContentPane, 
	Button, 
	dom,
	template
){
		
	return dojo.declare("ps2.widget.PlyrWinMin", [ _Widget, _Templated ], {

		templateString: template, //dojo.cache("example", "templates/SomeWidget.html"),
		widgetsInTemplate: true,
		websock: null,
		player_name: '',
		player_id: '',
		player_stats: null,
		
		//  your custom code goes here
		constructor: function (params) {
			console.log("PlyrWinMin constructor params:", params);
			if( params.player_id == null && params.player_name == null ) {
				console.error("PlyWinMin needs a player id or name!");
			}
			
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
			
			self.myGet = script.get({
				url: 'http://census.soe.com/s:rch/get/ps2/character/',
				handleAs: 'json',
				content: {
					"name.first_lower": self.player_name,
					"c:resolve": "online_status"
				},
				callbackParamName: "callback",
			}).then(function (data) {
				console.log("then data:", data);
				self.setStats(data.character_list[0]);
				self.finishedLoad();
			});
		
		},
		
		setStats: function(character_data) {
			
			// set player name
			this.p_name.innerHTML = character_data.name.first;
			
			// set player BR 
			this.p_br.innerHTML = character_data.battle_rank.value;
			
			this.player_stats = character_data;
		},
		
		finishedLoad: function () {
			var self = this;
			
			dojo.style(this.p_body, {
				"display": "block"
			});
			
			// test stuff here
			setTimeout(function () {
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
			}, 1000);
		},
		
		finishedUpdate: function () {
		
		},
		
	});

});