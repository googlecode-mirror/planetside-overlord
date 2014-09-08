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
		
		pushEvent: function (event) {
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
			
		},
		
		
		
	});

});