/** 
	playerFeed.js
	This contains a playerfeed
**/

function PlayerFeed (params) {
	var self = this;
	this.pname = params.pname;
	this.pid = '';
	this.data = {};
	this.connection = {};
	this.outfitKills = 0.0;
	this.outfitDeaths = 0.0;
	this.mContainer = {};
	this.con_id = '#'+params.con_id;
	this.label_id = '#'+params.label_id;
	this.feed_id = '#'+params.feed_id;
	this.online_id = '#'+params.online_id;
	this.kdRatio_id = '#'+params.kdRatio_id;
	this.kills_id = '#'+params.kills_id;
	this.deaths_id = '#'+params.deaths_id;
	this.onInfoComplete = params.onInfoComplete;
	this.onSocketOpen = params.onSocketOpen;
	
	this.clearFields();
	this.pContainer = new PlayerContainer();
	
	$.ajax({ 
	   type: "GET",
	   dataType: "jsonp",
	   url: 'http://census.soe.com/get/ps2/character/?name.first_lower=' + self.pname + '&c:resolve=online_status',
	   //url: 'http://census.soe.com/get/ps2/character/?name.first_lower=' + self.pname,
	   success: function(data){
		 console.log("RCH startup():", data);
		 //self.init( data.character_list[0].character_id, player_name);
		 self.pid = data.character_list[0].character_id;
		 self.data = data.character_list[0];
		 //console.log("RCH data:", self.data);
		 self.onInfoComplete(self.data);
		 self.webSockStart(self.pid);
	   }
	});
	
	this.pContainer = new PlayerContainer();
	
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
		 self.onSocketOpen();
	};

	// Log errors
	this.connection.onerror = function (error) {
	  console.error('WebSocket Error :', error);
	  $(self.feed_id).html( 'Connection Error! ' + '<br />' + $(self.feed_id).html() );
	};

	// Process messages
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
	$(this.online_id).val( '1' );
	$(this.feed_id).html( "<i>"+this.pname+ " Logged in </i><br />" + $(this.feed_id).html() );
}

PlayerFeed.prototype.handleLogoutEvent = function(msg) {
	var self = this;
	$(this.online_id).val( '0' );
	$(this.feed_id).html( "<i>"+this.pname+ " Logged out </i><br />" + $(this.feed_id).html() );
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
}

PlayerFeed.prototype.showKillEvent = function(member, other, memIsAttacker, msg) {
	var mode = msg.payload.attacker_fire_mode_id;
	var wep = msg.payload.attacker_weapon_id;
	var aLoad = msg.payload.attacker_loadout_id;
	var veh = msg.payload.attacker_vehicle_id;
	var vLoad = msg.payload.character_loadout_id;
	var headshot = msg.payload.is_headshot;
	var verb = '';//= msg.payload.is_headshot;
	
	// get verb
	if( headshot == '1' ) {
		verb = ' HS\'d ';
		console.log("verb =",verb);//rch 
	} else {
		verb = ' killed ';
	}
	if( veh != '0' ) {
		veh = ' in ' + veh;
	} else {
		veh = '';
	}
	
	if( memIsAttacker ) {
		
		$(this.feed_id).html( "<strong>" + member + verb + other + '<br /> with ' + wep + veh + '</strong><br />' + $(this.feed_id).html() );
		this.outfitKills++;
		$(this.kills_id).val( this.outfitKills.toFixed(0) );
	} else {
		$(this.feed_id).html( other + verb + member + '<br /> with ' + wep + veh +'</strong><br />' + $(this.feed_id).html() );
		this.outfitDeaths++;
		$(this.deaths_id).val( this.outfitDeaths.toFixed(0) );
	}
	this.updateKD();
}

PlayerFeed.prototype.clearFields = function() {
	$(this.feed_id).html( '' );
	$(this.con_id).val( 'Connecting...' );
	$(this.online_id).val( '' );
	$(this.kdRatio_id).val( '' );
	$(this.kills_id).val( '0' );
	$(this.deaths_id).val( '0' );
}

PlayerFeed.prototype.closeAll = function() {
	this.connection.close();
}





