/** 
	outfitEventFeed.js
	Feed that shows kills and deaths of all outfit members. Does not sort by player.
**/

function OutfitFeed (params) {
	var self = this;
	var tag = params.tag;
	this.connection = {};
	this.outfitKills = 0.0;
	this.outfitDeaths = 0.0;
	this.mContainer = {};
	this.updater = null;
	this.con_id = '#'+params.con_id;
	this.label_id = '#'+params.label_id;
	this.feed_id = '#'+params.feed_id;
	this.totalM_id = '#'+params.totalM_id;
	this.kdRatio_id = '#'+params.kdRatio_id;
	this.kills_id = '#'+params.kills_id;
	this.deaths_id = '#'+params.deaths_id;
	this.onInfoComplete = params.onInfoComplete;
	this.onSocketOpen = params.onSocketOpen;
	
	this.clearFields();
	
	// create outfit info
	this.mContainer = new MemContainer({
		tag: params.tag, 
		onComplete: function() {
			//console.log("FEED mContainer.getMemIdArr();", self.mContainer.getMemIdArr() );
			self.onInfoComplete(self.mContainer.data);
			self.webSockStart();
			console.log("FEED tagNormal:", self.mContainer.getTagNormal() );
			console.log("FEED label_id:", self.label_id );
			$(self.label_id).text( '[' + self.mContainer.getTagNormal() + ']' );
			//this.setTagByLabel( );
		}
	});
	
}

// Start WebSocket connection
OutfitFeed.prototype.webSockStart = function() {
	var self = this;
	
	this.connection = new WebSocket('wss://push.planetside2.com/streaming?service-id=s:rch');
	
	// When the connection is open, send some data to the server
	this.connection.onopen = function () {
		//console.log("this. connection opened");
		var kill_events = '{"service":"event","action":"subscribe","characters":[' + self.mContainer.getMemIdArr() + '],"eventNames":["Death","PlayerLogin","PlayerLogout"]}';
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
			//console.log("msg:", msg);
		}
		if( msg.service == 'event' && msg.type == 'serviceMessage' ) {
			self.handleEvent( msg );
		}
	};/**/
	
	// check connection status
	this.updater = setInterval( function(){
		self.updateStatus();
		self.updateTotalMembers();
	},2000);
}

OutfitFeed.prototype.updateStatus = function() {
	//console.log("con status:", this.connection.readyState,"con_id:", this.con_id);
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

OutfitFeed.prototype.updateTotalMembers = function() {
	$(this.totalM_id).val(this.mContainer.onlineCount+" of "+this.mContainer.memArr.length);
}

OutfitFeed.prototype.updateKD = function() {
	if( this.outfitDeaths == 0 ) {
		$(this.kdRatio_id).val(this.outfitKills.toFixed(2));
	} else {
		var kd = this.outfitKills/this.outfitDeaths;
		$(this.kdRatio_id).val( kd.toFixed(2) );
	}
}

// ************ EVENTS ***************
OutfitFeed.prototype.handleEvent = function(msg) {
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

OutfitFeed.prototype.handleLoginEvent = function(msg) {
	var self = this;
	var player_id = msg.payload.character_id;
	var index = this.mContainer.indexOfId(player_id);
	if( index >= 0 ) {
		//console.log("FEED: "+this.mContainer.memArr[index].name+" Logged on");
		this.mContainer.memArr[index].isOnline = '1';
		this.mContainer.onlineCount++;
		$(this.feed_id).html( "<i>"+this.mContainer.memArr[index].name+ " Logged on </i><br />" + $(this.feed_id).html() );
	} else {
		console.error("Error: player_id:"+player_id+" logged on, not in outfit?");
	}
}

OutfitFeed.prototype.handleLogoutEvent = function(msg) {
	var self = this;
	var player_id = msg.payload.character_id;
	var index = this.mContainer.indexOfId(player_id);
	if( index >= 0 ) {
		//console.log("FEED: "+this.mContainer.memArr[index].name+" Logged out");
		this.mContainer.memArr[index].isOnline = '0';
		this.mContainer.onlineCount--;
		$(this.feed_id).html( "<i>"+this.mContainer.memArr[index].name+ " Logged out </i><br />" + $(this.feed_id).html() );
	} else {
		console.error("Error: player_id:"+player_id+" logged out, not in outfit?");
	}
}

OutfitFeed.prototype.handleKillEvent = function(msg) {
	var self = this;
	var attacker = msg.payload.attacker_character_id;
	var victim = msg.payload.character_id;
	var member = '';
	var other = '';
	var memIsAttacker = true;
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

	// store player in P_INFO
	P_INFO.addById(other, function() {// onComplete
		WEP_INFO.addById(msg.payload.attacker_weapon_id, function() {// onComplete
			VEH_INFO.addById(msg.payload.attacker_vehicle_id, function() {// onComplete
				self.showKillEvent(
					member, 
					P_INFO.getNameById(other), 
					memIsAttacker, 
					msg,
					WEP_INFO.getNameById(msg.payload.attacker_weapon_id),
					VEH_INFO.getNameById(msg.payload.attacker_vehicle_id),
					P_INFO.getOutfitAliasById(other),
					P_INFO.getBattleRankById(other)
				);
			});
		});
	});
	//P_INFO.myPrint();
}

OutfitFeed.prototype.showKillEvent = function(member, other, memIsAttacker, msg, wep_name, veh_name, _outfit, br) {
	var mode = msg.payload.attacker_fire_mode_id;
	//var wep = msg.payload.attacker_weapon_id;
	var wep = wep_name;
	var aLoad = msg.payload.attacker_loadout_id;
	var veh = msg.payload.attacker_vehicle_id;
	var vLoad = msg.payload.character_loadout_id;
	var headshot = msg.payload.is_headshot;
	var verb = '';//= msg.payload.is_headshot;
	
	// get outfit
	var outfit = '[]';
	if( _outfit != null ) {
		outfit = '['+_outfit+']';
	} else {
		outfit = '';
	}
	
	// get battle_rank
	outfit = outfit + br + ':';
	
	// get verb
	if( headshot == '1' ) {
		verb = ' HS\'d ';
	} else {
		verb = ' killed ';
	}
	if( veh != '0' ) {
		veh = ' in ' + veh_name;
	} else {
		veh = '';
	}
	
	if( memIsAttacker ) {
		$(this.feed_id).html( "<strong>" + member + (member==other?' committed suicide...':verb + outfit + other) + '<br /> with ' + wep + veh +'</strong><br />' + $(this.feed_id).html() );
		this.outfitKills++;
		$(this.kills_id).val( this.outfitKills.toFixed(0) );
	} else {
		$(this.feed_id).html( outfit + other + verb + member + '<br /> with ' + wep + veh +'</strong><br />' + $(this.feed_id).html() );
		this.outfitDeaths++;
		$(this.deaths_id).val( this.outfitDeaths.toFixed(0) );
	}
	this.updateKD();
}

OutfitFeed.prototype.clearFields = function() {
	$(this.feed_id).html( '' );
	$(this.con_id).val( 'Connecting...' );
	$(this.totalM_id).val( '' );
	$(this.kdRatio_id).val( '' );
	$(this.kills_id).val( '0' );
	$(this.deaths_id).val( '0' );
}

OutfitFeed.prototype.closeAll = function() {
	this.connection.close();
	clearInterval(this.updater);
}
  












