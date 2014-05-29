/** 
	playerFeed.js
	This contains a playerfeed
**/

function PlayerFeed (params) {
	var self = this;
	this.pname = params.pname;
	this.pid = '';
	this.connection = {};
	this.outfitKills = 0.0;
	this.outfitDeaths = 0.0;
	this.mContainer = {};
	this.con_id = '#'+params.con_id;
	this.label_id = '#'+params.label_id;
	this.feed_id = '#'+params.feed_id;
	this.totalM_id = '#'+params.totalM_id;
	this.kdRatio_id = '#'+params.kdRatio_id;
	this.kills_id = '#'+params.kills_id;
	this.deaths_id = '#'+params.deaths_id;
	
	this.clearFields();
	this.pContainer = new PlayerContainer();
	
	$.ajax({ 
	   type: "GET",
	   dataType: "jsonp",
	   url: 'http://census.soe.com/get/ps2/character/?name.first_lower=' + self.pname,//'http://census.soe.com/s:rch/get/ps2:v2/character/?character_id=' + victim + '&c:show=name',
	   success: function(data){
		 console.log("RCH startup():", data);
		 //self.init( data.character_list[0].character_id, player_name);
		 self.pid = data.character_list[0].character_id;
		 self.webSockStart(self.pid);
	   }
	});
	
	this.pContainer = new PlayerContainer();
	
	// create outfit info
	//this.mContainer = new MemContainer({
		//tag: params.tag, 
		//onComplete: function() {
			//console.log("FEED mContainer.getMemIdArr();", self.mContainer.getMemIdArr() );
			//self.webSockStart();
			//console.log("FEED pnameNormal:", self.mContainer.getPnameNormal() );
			//console.log("FEED label_id:", self.label_id );
			//$(self.label_id).text( '[' + self.mContainer.getTagNormal() + ']' );
			//this.setTagByLabel( );
		//}
	//});
	
}

// Start WebSocket connection
PlayerFeed.prototype.webSockStart = function(pid) {
	var self = this;
	
	this.connection = new WebSocket('wss://push.planetside2.com/streaming?service-id=s:rch');
	
	// When the connection is open, send some data to the server
	this.connection.onopen = function () {
		//console.log("this. connection opened");
		var kill_events = '{"service":"event","action":"subscribe","characters":["' + pid + '"],"eventNames":["Death","PlayerLogin","PlayerLogout"]}';
		//var kill_events = '{"service":"event","action":"subscribe","characters":[' + self.mContainer.getMemIdArr() + '],"eventNames":["Death","PlayerLogin","PlayerLogout"]}';
		console.log("kill_events:", kill_events);
		self.connection.send(kill_events);
		self.updateStatus();
	};

	// Log errors
	this.connection.onerror = function (error) {
	  console.error('WebSocket Error :', error);
	  $(self.feed_id).html( 'Connection Error! ' + '<br />' + $(self.feed_id).html() );
	};

	// Log kill_streams from the server
	this.connection.onmessage = function (e) {
		var msg = jQuery.parseJSON( e.data );
		if( msg.type != 'serviceStateChanged' ) {
			console.log("msg:", msg);
		}
		if( msg.service == 'event' && msg.type == 'serviceMessage' ) {
			self.handleEvent( msg );
		}
	};/**/
	
	// check connection status
	setInterval( function(){
		self.updateStatus();
		//self.updateTotalMembers();
	},2000);
}

PlayerFeed.prototype.updateStatus = function() {
	console.log("con status:", this.connection.readyState,"con_id:", this.con_id);
	if (this.connection != null) {
		switch(this.connection.readyState) {
			case 0:
				$(this.con_id).val(this.connection.readyState+': Not open');
			break;
			case 1:
				$(this.con_id).val(this.connection.readyState+': Connected');
			break;
			case 2:
				$(this.con_id).val(this.connection.readyState+': Closing...');
			break;
			case 3:
				$(this.con_id).val(this.connection.readyState+': Closed');
			break;
		}
	} else {
		
	}
}

//PlayerFeed.prototype.updateTotalMembers = function() {
	//$(this.totalM_id).val(this.mContainer.onlineCount+" of "+this.mContainer.memArr.length);
//}

PlayerFeed.prototype.updateKD = function() {
	if( this.outfitDeaths == 0 ) {
		$(this.kdRatio_id).val(this.outfitKills.toFixed(2));
	} else {
		var kd = this.outfitKills/this.outfitDeaths;
		$(this.kdRatio_id).val( kd.toFixed(2) );
	}
}

// ************ EVENTS ***************
PlayerFeed.prototype.handleEvent = function(msg) {
	//console.log("FEED: handleEvent: ", msg.payload.event_name);
	switch( msg.payload.event_name ) {
		case 'Death':
			this.handleKillEvent(msg);
			break;
			
		case 'PlayerLogin':
			this.handleLoginEvent(msg);
			break;
			
		case 'PlayerLogout':
			this.handleLogoutEvent(msg);
			break;
			
		default:
			break;
	
	}
}

PlayerFeed.prototype.handleLoginEvent = function(msg) {
	var self = this;
	$(this.feed_id).html( "<i>"+this.pname+ " Logged in </i><br />" + $(this.feed_id).html() );
	/*var player_id = msg.payload.character_id;
	var index = this.mContainer.indexOfId(player_id);
	if( index >= 0 ) {
		//console.log("FEED: "+this.mContainer.memArr[index].name+" Logged on");
		this.mContainer.memArr[index].isOnline = '1';
		this.mContainer.onlineCount++;
		$(this.feed_id).html( "<i>"+this.mContainer.memArr[index].name+ " Logged on </i><br />" + $(this.feed_id).html() );
	} else {
		console.error("Error: player_id:"+player_id+" logged on, not in outfit?");
	}*/
}

PlayerFeed.prototype.handleLogoutEvent = function(msg) {
	var self = this;
	$(this.feed_id).html( "<i>"+this.pname+ " Logged out </i><br />" + $(this.feed_id).html() );
	/*var player_id = msg.payload.character_id;
	var index = this.mContainer.indexOfId(player_id);
	if( index >= 0 ) {
		//console.log("FEED: "+this.mContainer.memArr[index].name+" Logged out");
		this.mContainer.memArr[index].isOnline = '0';
		this.mContainer.onlineCount--;
		$(this.feed_id).html( "<i>"+this.mContainer.memArr[index].name+ " Logged out </i><br />" + $(this.feed_id).html() );
	} else {
		console.error("Error: player_id:"+player_id+" logged out, not in outfit?");
	}*/
}

PlayerFeed.prototype.handleKillEvent = function(msg) {
	var self = this;
	var attacker = msg.payload.attacker_character_id;
	var victim = msg.payload.character_id;
	var playerIsAttacker = ( attacker == this.pid );
	var other = '';
	if( playerIsAttacker ) {
		other = victim;
	} else {
		other = attacker;
	}
	
	var index = this.pContainer.indexOfId(other);
	
	if( index >= 0 ) {// other already in feed
		other = this.pContainer.getNameByIndex(index);
		this.showKillEvent(self.pname, other, playerIsAttacker, msg);
	} else {// other not in feed
		$.ajax({
			type: "GET",
			dataType: "jsonp",
			url: 'http://census.soe.com/s:rch/get/ps2:v2/character/?character_id=' + other + '&c:show=name',
			success: function(data){
				if( data.character_list[0].name.first == null ) {
					console.error("handleKillEvent Error on name:", data.character_list[0].name);
				} else {
					other = data.character_list[0].name.first;// CHECK FOR .name == null
				}
				self.showKillEvent(self.pname, other, playerIsAttacker, msg);
			}
		});
	}
	
	/*var memIsAttacker = true;
	var index = this.mContainer.indexOfId(attacker);
	
	// get member name 
	if( index >= 0 ) {// mem is attacker
		other = victim;
		member = this.mContainer.memArr[index].name;
	} else {// mem is victim
		other = attacker;
		member = this.mContainer.memArr[this.mContainer.indexOfId(victim)].name;
		memIsAttacker = false;
	}

	// get other name
	index = this.pContainer.indexOfId(other);
	if( index >= 0 ) {// other already in feed
		other = this.pContainer.parr[index].name;
		this.showKillEvent(member, other, memIsAttacker);
	} else {// other not in feed
		$.ajax({
			type: "GET",
			dataType: "jsonp",
			url: 'http://census.soe.com/s:rch/get/ps2:v2/character/?character_id=' + other + '&c:show=name',
				success: function(data){
					if( data.character_list[0].name.first == null ) {
						console.error("handleKillEvent Error on name:", data.character_list[0].name);
					} else {
						other = data.character_list[0].name.first;// CHECK FOR .name == null
					}
					self.showKillEvent(member, other, memIsAttacker);
			}
		});
	}*/
}

PlayerFeed.prototype.showKillEvent = function(member, other, memIsAttacker, msg) {
	var mode = msg.payload.attacker_fire_mode_id;
	var wep = msg.payload.attacker_weapon_id;
	var aLoad = msg.payload.attacker_loadout_id;
	var veh = msg.payload.attacker_vehicle_id;
	var vLoad = msg.payload.character_loadout_id;
	var headshot = msg.payload.is_headshot;
	
	if( memIsAttacker ) {
		
		$(this.feed_id).html( "<strong>"+member+ " killed "+ other + '<br /> with ' + wep + veh + '</strong><br />' + $(this.feed_id).html() );
		this.outfitKills++;
		$(this.kills_id).val( this.outfitKills.toFixed(0) );
	} else {
		$(this.feed_id).html( other + " killed "+ member + '<br /> with ' + wep + veh +'</strong><br />' + $(this.feed_id).html() );
		this.outfitDeaths++;
		$(this.deaths_id).val( this.outfitDeaths.toFixed(0) );
	}
	this.updateKD();
}

PlayerFeed.prototype.clearFields = function() {
	$(this.feed_id).html( '' );
	$(this.con_id).val( 'Connecting...' );
	$(this.totalM_id).val( '' );
	$(this.kdRatio_id).val( '' );
	$(this.kills_id).val( '0' );
	$(this.deaths_id).val( '0' );
}

PlayerFeed.prototype.closeAll = function() {
	this.connection.close();
}




/*
function Info (type) {
	this.id = '';
	this.name = '';
	this.kills = 0;// times killed you
	this.deaths = 0;// times killed by you
}

Info.prototype.getInfo = function() {
	var _n = '<td style="width:10em"' + ' id="'+this.id + '_n">' + this.name + '</td>';
	var _k = '<td style="width:3em"' + ' id="'+this.id + '_k">' + this.kills + '</td>';
	var _d = '<td style="width:3em"' + ' id="'+this.id + '_d">' + this.deaths + '</td>';
	var _h = '<td style="width:30em"' + ' id="'+this.id + '_h"></td>';
    return _n + _k + _d + _h;
};

Info.prototype.updateKD = function() {
	$("#" + this.id + "_k").text( this.kills );
	$("#" + this.id + "_d").text( this.deaths );
};

Info.prototype.addHistory = function(h) {
	var idt = this.id + '_h';
	$("#" + idt).text( $("#" + idt).text() + h );
	console.log("RCH addHistory:" + $("#" + idt).html() );
};

// CREATE PlayerFeed OBJECT
function PlayerFeed (pname) {
this.player_name = pname;
this.connection;// = new WebSocket('wss://push.planetside2.com/streaming?service-id=s:rch');
this.ratch_id = '';//'5428010618043506641';
this.user_id = '';
this.user_name = '';
this.player_arr = [];
this.counter = '99';
this.p = Info;
this.startup(this.player_name);
}

// Button for testing / debug		
//$(document).ready(function(){
PlayerFeed.prototype.onReady = function() {
	console.log("onReady()");
	
	$("#ratch_init").click(function() {
		startup( 'ratch' );
	});

	$("#init_button").click(function() {
		startup( $("#player_name_field").val() );
	});

	$("#button1").click(function() {
		addPlayer('12341234123412341324', 'noob5000');
	});
	
	$("#button2").click(function() {
		 playerKill( addPlayer(ratch_id, user_name) );
		 playerDeath( addPlayer(ratch_id, user_name) );
		 getKillData(null, user_name, user_name);
	});
	
	$("#button3").click(function() {
		 playerKill( addPlayer(counter++, counter++) );
		 getKillData(null, counter, user_name);
	});
	
	$("#button4").click(function() {
		 playerDeath( addPlayer(counter++, counter++) );
		 getKillData(null, user_name, counter);
	});
	
	$("#button5").click(function() {
		var ind = Math.floor( Math.random() * player_arr.length );
		console.log("BUTTON5 ind=", ind);
		playerDeath( addPlayer(player_arr[ind].id, player_arr[ind].name) );
		getKillData(null, player_arr[ind].name, user_name);
	});
};
// ************ STARTUP ********************
PlayerFeed.prototype.startup = function(player_name) {
	console.log("startup("+player_name+")");
   var self = this;
	$.ajax({ 
	   type: "GET",
	   dataType: "jsonp",
	   url: 'http://census.soe.com/get/ps2/character/?name.first_lower=' + player_name,//'http://census.soe.com/s:rch/get/ps2:v2/character/?character_id=' + victim + '&c:show=name',
	   success: function(data){
		 console.log("RCH startup():", data);
		 self.init( data.character_list[0].character_id, player_name);
	   }
	});
};

PlayerFeed.prototype.init = function(player_id, player_name) {
	console.log("RCH init " );
	//user_id = player_id;
	ratch_id = player_id;
	user_name = player_name;
	connection = new WebSocket('wss://push.planetside2.com/streaming?service-id=s:rch');
	
	/////////////////////start connection define
	// When the connection is open, send some data to the server
	connection.onopen = function () {
	  //connection.send('Ping'); // Send the kill_stream 'Ping' to the server
	  var kill_events = '{"service":"event","action":"subscribe","characters":["' + ratch_id + '"],"eventNames":["Death"]}';
	  connection.send(kill_events);
	  console.log("RCH connection opened");
	  
	};

	// Log errors
	connection.onerror = function (error) {
	  console.log('WebSocket Error ' + error);
	};

	// Log kill_streams from the server
	connection.onmessage = function (e) {
	  var msg = jQuery.parseJSON( e.data );
	  if( msg.type != 'serviceStateChanged' ) {
		console.log("msg:", msg);
	  }
	  
	  
		if( msg.service == 'event' && msg.type == 'serviceMessage' ) {
			var attacker = msg.payload.attacker_character_id;
			var victim = msg.payload.character_id;
			
			if (attacker == ratch_id) {// ratch kill!
				$.ajax({ 
				   type: "GET",
				   dataType: "jsonp",
				   url: 'http://census.soe.com/s:rch/get/ps2:v2/character/?character_id=' + victim + '&c:show=name',
				   success: function(data){
					 console.log("RCH success()1:", data);
					 playerDeath( addPlayer(victim, data.character_list[0].name.first) );
					 getKillData(data, user_name, data.character_list[0].name.first);
				   }
				});
				
			} else if (victim == ratch_id) {//ratch died...
				$.ajax({ 
				   type: "GET",
				   dataType: "jsonp",
				   url: 'http://census.soe.com/s:rch/get/ps2:v2/character/?character_id=' + attacker + '&c:show=name',
				   success: function(data){
					 console.log("RCH success()2:", data);
					 playerKill( addPlayer(attacker, data.character_list[0].name.first) );
					 getKillData(data,  data.character_list[0].name.first, user_name);
				   }
				});
				
			}
		}
		
	};// end connection.onmessage
	///////end connection define
};//end init

PlayerFeed.prototype.addPlayer = function(player_id, player_name) {
	//console.log("RCH addPlayer(", player_id, ", ", player_name, ")");
	ind = playerIndex(player_id);
	//console.log("RCH addPlayer() ind:", ind);
	if( ind < 0 ) {
		p = new Info();// add player
		p.id = player_id;
		p.name = player_name;
		ind = player_arr.length;
		player_arr.push( p );
		//$("#player_cache").html( player_name + '<br />' + $("#player_cache").html());
		//$('#player_cache tr:last').after('<tr id="' + player_id + '_tr">' + p.getInfo + '</tr>');
		$('#player_cache').append('<tr id="' + player_id + '_r">' + p.getInfo() + '</tr>');
		
		//console.log("RCH cache:" + $('#player_cache').html() );
	}
	return ind;
};

PlayerFeed.prototype.playerDeath = function(ind) {
	player_arr[ind].deaths++;
	player_arr[ind].addHistory("D");
	player_arr[ind].updateKD();
};

PlayerFeed.prototype.playerKill = function(ind) {
	player_arr[ind].kills++;
	player_arr[ind].addHistory("K");
	player_arr[ind].updateKD();
};

PlayerFeed.prototype.playerIndex = function(player_id) {
	var found = -1;
	for( var i = 0; i < player_arr.length; i++ ) {
		//console.log("FOR" + i + " player_arr[i].id=", player_arr[i].id, "RCH player_id=", player_id);
		if ( player_arr[i].id == player_id ) {
			found = i;
			break;
		}
	}
	return found;
};
  
PlayerFeed.prototype.getKillData = function(data, attacker, victim) {// data not used
	console.log('RCH getKillData() attacker:', attacker, ' victim:', victim); 
	if (attacker == victim) {//suicide
		$("#kill_stream").html( '<hr><i>'+attacker+' committed suicide...</i><br />' + $("#kill_stream").html());
	} else 	if( attacker == user_name ) {
		$("#kill_stream").html( '<strong>&nbsp;'+attacker+' killed '+victim+'</strong><br />' + $("#kill_stream").html());
	} else {
		$("#kill_stream").html( '-<br />' + attacker + ' killed '+victim+'<br />' + $("#kill_stream").html());
	}
};


PlayerFeed.prototype.mainLoop = function() {





	// check connection status
	setInterval(function(){
		if (connection != null) {
			switch(connection.readyState) {
				case 0:
					$("#con_status").val(connection.readyState+': connection not yet established');
				break;
				case 1:
					$("#con_status").val(connection.readyState+': conncetion established');
				break;
				case 2:
					$("#con_status").val(connection.readyState+': in closing handshake');
				break;
				case 3:
					$("#con_status").val(connection.readyState+': connection closed or could not open');
				break;
			}
		}
	},1000);
};
*/










