/** 
	bountyWindow.js
	Scans kills in past hour and determines if a bounty exists for your outfit.
**/
function BountyWindow (params) {
	var self = this;
	var tag = params.tag;
	var wall_id = '#' + params.wall_id;
	var window_id = '#bounty_window_' + BountyWindow.feedId;
	var eventArr = [];
	var mContainer = {};
	var pContainer = {};
	var connection = null;
	var updater = null;
	
	BountyWindow.feedId++;
	
	_create();
	_createMemContainer();
	_createPlayerContainer();
	//_addPlayer(1);

// PRIVATE FUNCTIONS
	
	function _create(){
		console.log("wall_id:",wall_id," for tag:",tag);
		$(wall_id).append('<table border="1px"></table>');
		$(wall_id + ' table:last').attr("id", window_id.substring(1));
		$(window_id).append('<tr> <th>Name</th><th>Kills</th> </tr>');
	}
	
	// Fetch all members in this outfit
	function _createMemContainer(){
		mContainer = new MemContainer({
			tag: tag, 
			onComplete: function() {
				console.log("BountyWindow mContainer;", mContainer.getMemIdArr() );
				_webSockStart();
			}
		});
	}
	
	function _createPlayerContainer(){
		pContainer = new PlayerContainer();
	}
	
	// Start WebSocket connection
	function _webSockStart(){
		var self = this;
		
		connection = new WebSocket('wss://push.planetside2.com/streaming?service-id=s:rch');
		
		// When the connection is open, send some data to the server
		connection.onopen = function () {
			//console.log("this. connection opened");
			var kill_events = '{"service":"event","action":"subscribe","characters":[' + mContainer.getMemIdArr() + '],"eventNames":["Death"]}';
			console.log("kill_events:", kill_events);
			connection.send(kill_events);
			//self.updateStatus();
		};

		// Log errors
		connection.onerror = function (error) {
		  console.error('WebSocket Error :', error);
		  //$(self.feed_id).html( 'Connection Error! ' + '<br />' + $(self.feed_id).html() );
		};

		// Log kill_streams from the server
		connection.onmessage = function (e) {
			var msg = jQuery.parseJSON( e.data );
			if( msg.type != 'serviceStateChanged' ) {
				console.log("msg:", msg);
			}
			if( msg.service == 'event' && msg.type == 'serviceMessage' ) {
				_handleEvent( msg );
			}
		};/**/
		
		// check connection status
		updater = setInterval( function(){
			//self.updateStatus();
			//self.updateTotalMembers();
		},2000);

	}
	
	function _handleEvent(msg){
		console.log("_handleEvent( msg=",msg,")");
		
		var victim_id = msg.payload.character_id;
		var attacker_id = msg.payload.attacker_character_id;
		
		if( mContainer.indexOfId(victim_id) >= 0 ) {// if member is victim
			console.log("MEMBER IS VICTIM!");
			_handleKillEvent(attacker_id);
			_updateTable(attacker_id);
		}
	}
	
	function _handleKillEvent(id) {
		
		

		// store player in P_INFO
		P_INFO.addById(id, function() {// onComplete
			//WEP_INFO.addById(msg.payload.attacker_weapon_id, function() {// onComplete
				//VEH_INFO.addById(msg.payload.attacker_vehicle_id, function() {// onComplete
				
					// do stuff here
					var row_id = 'bounty_'+tag+"_"+id;//todo: change tag to feedId for multiple bountys of same outfit
					var row_kills_id = 'bounty_'+tag+"_kills_"+id;//todo: change tag to feedId
					
					if( pContainer.indexOfId(id) < 0 ) {// new player
						pContainer.addById(id);
						
						// add Row To Table
						$(window_id).append('<tr> </tr>');
						$(window_id + ' tr:last').attr("id", row_id);
						$(window_id + ' tr:last').append('<td>'+P_INFO.getNameById(id)+'</td>');
						$(window_id + ' tr:last').append('<td>'+pContainer.getKillsById(id)+'</td>');
						$(window_id + ' td:last').attr("id", row_kills_id);
						//$(window_id).append('<tr> <td>Player</td><td>55</td> </tr>');
						//$(window_id).append('<tr> <td>Player</td><td>55</td> </tr>');
						
					} else {// existing player kill
						pContainer.addById(id);
						//_updateTable(id);
						$('#'+row_kills_id).html(pContainer.getKillsById(id));
					}
				
					/*addEvent(
						member, 
						P_INFO.getNameById(other), 
						memIsAttacker, 
						msg,
						WEP_INFO.getNameById(msg.payload.attacker_weapon_id),
						VEH_INFO.getNameById(msg.payload.attacker_vehicle_id),
						P_INFO.getOutfitAliasById(other),
						P_INFO.getBattleRankById(other)
					);*/
				//});
			//});
		});
	}
	
	function _updateTable(id) {
		
		// update the table for this player
	}
	
	
	// PRIVILEDGED FUNCTIONS
	//this.closeWin = _closeThis;// give public access to _closeThis() 
}

BountyWindow.feedId = 0;







