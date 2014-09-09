define([
	"dojo/io/script", 
	"dijit/_Widget", 
	"dijit/_Templated", 
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom",
	"dojo/text!./PlyrKillQue.html",
], function(
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
		
		pushQue: function (txt) {
			var self = this;
			console.log("PlyrKillQue pushQue: ", txt);
			
			var query = dojo.query("div", self.p_que);
			console.log("query:", query);
			console.log("length:", query.length);
			
			if( query.length >= 8 ) { // remove last
				console.log("destroy: ", query[query.length-1]);
				domConstruct.destroy(query[query.length-1]);
			}
			
			switch(txt) {
				case 'D':
					// create Death txt
					var node = domConstruct.create("div", {innerHTML: txt}, self.p_que, "first");
					dojo.replaceClass(node, "p_que_d", ["p_que_k", "p_que_r", "p_que_d", "p_que_s"]);
				break;
					
				case 'SS':
					// create Suicide txt
					var node = domConstruct.create("div", {innerHTML: txt}, self.p_que, "first");
					dojo.replaceClass(node, "p_que_s", ["p_que_k", "p_que_r", "p_que_d", "p_que_s"]);
				break;
					
				case 'K':
					// create Kill txt
					var node = domConstruct.create("div", {innerHTML: txt}, self.p_que, "first");
					dojo.replaceClass(node, "p_que_k", ["p_que_k", "p_que_r", "p_que_d", "p_que_s"]);
				break;
				
			}
		},
		
		handleKillEvent: function (event) {
			console.log("attacker :", event.attacker_character_id);
			console.log("player_id:", this.player_id);
			if( event.attacker_character_id == this.player_id ) {	
				// Player killed someone or self
				
				if( event.character_id == this.player_id ) {	
					
					// Player kill self
					this.handleSuicide(event);
					
				} else {
				
					// Player killed someone and NOT self
					
					// TODO if( kill_was_TK ) {
					//			this.handleKillTK();
					//		} else {
								this.handleKillBasic(event);
					// 		}
				}
			
			} else if(  event.attacker_character_id != this.player_id ) {
				
				// Player victim of someone and NOT self	
				
				// TODO if( death_was_TK ) {
				//			this.handleDeathTK();
				//		} else {
							this.handleDeathBasic(event)
				// 		}
			} else {
				
				// Not possible
			}
		},
		
		handleDeathBasic: function (event) {
			this.pushQue('D');
		},
		
		handleKillBasic: function (event) {
			this.pushQue('K');
		},
		
		handleKillTK: function (event) {
			// requires ajax call
		},
		
		handleDeathTK: function (event) {
			// requires ajax call
		},
		
		handleSuicide: function (event) {
			this.pushQue('SS');
		},
		
		handleLogin: function (event) {
		
		},
		
		handleLogout: function (event) {
		
		},
		
		
		
	});

});