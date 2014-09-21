define([
	"dijit/_Widget", 
	"dijit/_Templated", 
	"dojo/text!./PlyrKill.html",
], function(
	_Widget, 
	_Templated, 
	template
){
		
	return dojo.declare("ps2.widget.player.PlyrKill", [ _Widget, _Templated ], {

		templateString: template,
		websock: null,
		txt: 'TX',
		br: 'XX',
		hs: '0',
		
		
		//  your custom code goes here
		constructor: function (params) {
			console.log("PlyrKill constructor params:", params);
			
			
		},
		
		startup: function () {
			var self = this;
			console.log("PlyrKill startup ");
		
			
			dojo.ready(function(){
				self.setParams();
				self.setClass();
				
			});//end dojo.ready
			
		},
		
		setParams: function () {
			
			this.pk_txt.innerHTML = this.txt;
			this.pk_br.innerHTML = this.br;
			this.pk_hs.innerHTML = this.hs;
		},
		
		setClass: function () {
			var replaceThese = ["pk_k", "pk_r", "pk_d", "pk_s", "pk_td", "pk_tk"];
			switch(this.txt) {
				case 'D':
					// create Death txt
					dojo.replaceClass(this.pk_body, "pk_d", replaceThese);
				break;
					
				case 'SS':
					// create Suicide txt
					dojo.replaceClass(this.pk_body, "pk_s", replaceThese);
				break;
					
				case 'K':
					// create Kill txt
					dojo.replaceClass(this.pk_body, "pk_k", replaceThese);
				break;
					
				case 'TK':
					// create Kill txt
					dojo.replaceClass(this.pk_body, "pk_tk", replaceThese);
				break;
					
				case 'TD':
					// create Kill txt
					dojo.replaceClass(this.pk_body, "pk_td", replaceThese);
				break;
				
			}
		},
		
	});

});