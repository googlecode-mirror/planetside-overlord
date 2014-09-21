define([
	"ps2/widget/player/PlyrKill",
	
	"dojo/_base/fx",
	"dojo/fx",
	"dojo/io/script", 
	"dijit/_Widget", 
	"dijit/_Templated", 
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom",
	"dojo/text!./PlyrKillQue.html",
], function(
	PlyrKill,
	
	fx,
	coreFx,
	script, 
	_Widget, 
	_Templated, 
	domConstruct,
	domAttr,
	dom,
	template
){
		
	return dojo.declare("ps2.widget.player.PlyrKillQue", [ _Widget, _Templated ], {

		templateString: template,
		websock: null,
		player_name: '',
		player_id: '',
		player_stats: null,
		
		//  your custom code goes here
		constructor: function (params) {
			console.log("PlyrKillQue constructor params:", params);
			
			
		},
		
		startup: function () {
			var self = this;
			console.log("PlyrKillQue startup ");
		
			
			dojo.ready(function(){
				
				
			});//end dojo.ready
			
		},
		
		/*pushEvent: function (event) {
			var self = this;
			console.log("PlyrKillQue pushText: ", event);
			
			var query = dojo.query("div", self.p_que);
			console.log("query:", query);
			console.log("length:", query.length);
			
			if( query.length >= 8 ) { // remove last
				console.log("destroy: ", query[query.length-1]);
				domConstruct.destroy(query[query.length-1]);
			}
			// create Kill event
			var node = domConstruct.create("div", {innerHTML: event}, self.p_que, "first");
			dojo.replaceClass(node, "p_que_k", ["p_que_k", "p_que_r", "p_que_d"]);
			
		},*/
		
		pushEvent: function (event) {
			var self = this;
			console.log("PlyrKillQue pushEvent: ", event.event_name, " event:", event);
			
			switch(event.event_name) {
				case 'Death':
					this.handleKillEvent(event);
					break;
					
				case 'PlayerLogin':
					this.handleLogin(event);
					break;
					
				case 'PlayerLogout':
					this.handleLogout(event);
					break;
					
				default:
					break;
			}
			
		},
		
		pushQue: function (txt, br, hs) {
			var self = this;
			console.log("PlyrKillQue pushQue: ", txt);
			
			var query = dojo.query("div.PlyrKill", self.p_que);
			console.log("query:", query);
			console.log("length:", query.length);
			
			if( query.length >= 6 ) { // remove last
				console.log("destroy: ", query[query.length-1]);
				domConstruct.destroy(query[query.length-1]);
			}
			
			//var replaceThese = ["p_que_k", "p_que_r", "p_que_d", "p_que_s", "p_que_td", "p_que_tk"];
			var node = domConstruct.create("div", {innerHTML: txt}, self.p_que, "first");
			var kill = new PlyrKill({ 
				txt: txt,
				br: br,
				hs: hs,
			}, node);
			kill.startup();
			/*switch(txt) {
				case 'D':
					// create Death txt
					dojo.replaceClass(node, "p_que_d", replaceThese);
				break;
					
				case 'SS':
					// create Suicide txt
					dojo.replaceClass(node, "p_que_s", replaceThese);
				break;
					
				case 'K':
					// create Kill txt
					dojo.replaceClass(node, "p_que_k", replaceThese);
				break;
					
				case 'TK':
					// create Kill txt
					dojo.replaceClass(node, "p_que_tk", replaceThese);
				break;
					
				case 'TD':
					// create Kill txt
					dojo.replaceClass(node, "p_que_td", replaceThese);
				break;
				
			}*/
		},
		
		handleKillEvent: function (event) {
			console.log("PlyrKillQue handleKillEvent event :", event);
			console.log("attacker :", event.attacker_character_id);
			console.log("player_id:", this.player_id);
			if( event.attacker_character_id == this.player_id ) {	
				// Player killed someone or self
				
				if( event.character_id == this.player_id ) {	
					
					// Player kill self
					this.handleSuicide(event);
					
				} else {
				
					// Player killed someone and NOT self
					
					if( event.attacker_stats.faction_id == event.victim_stats.faction_id ) {
						this.handleKillTK(event);
					} else {
						this.handleKillBasic(event);
					}
				}
			
			} else if(  event.attacker_character_id != this.player_id ) {
				
				// Player victim of someone and NOT self	
				if( event.attacker_stats.faction_id == event.victim_stats.faction_id ) {
					this.handleDeathTK(event);
				} else {
					this.handleDeathBasic(event)
				}
			} else {
				
				// Not possible
			}
		},
		
		handleDeathBasic: function (event) {
			this.pushQue(
				'D', 
				event.attacker_stats.battle_rank.value,
				(event.is_headshot == '1' ? 'HS' : '')
			);
		},
		
		handleKillBasic: function (event) {
			this.pushQue(
				'K', 
				event.victim_stats.battle_rank.value,
				(event.is_headshot == '1' ? 'HS' : '')
			);
		},
		
		handleKillTK: function (event) {
			this.pushQue(
				'TK',
				event.victim_stats.battle_rank.value,
				(event.is_headshot == '1' ? 'HS' : '')
			);
		},
		
		handleDeathTK: function (event) {
			this.pushQue(
				'TD',
				event.attacker_stats.battle_rank.value,// error here
				(event.is_headshot == '1' ? 'HS' : '')
			);
		},
		
		handleSuicide: function (event) {
			this.pushQue(
				'SS',
				event.attacker_stats.battle_rank.value,
				(event.is_headshot == '1' ? 'HS' : '')
			);
		},
		
		handleLogin: function (event) {
		
		},
		
		handleLogout: function (event) {
		
		},
		
		
		
	});

});