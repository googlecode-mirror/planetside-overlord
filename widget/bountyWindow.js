/** 
	bountyWindow.js
	Scans kills in past hour and determines if a bounty exists for your outfit.
**/
function BountyWindow (params) {
	var self = this;
	var tag = params.tag;
	var wall_id = '#' + params.wall_id;
	var table_id = '#bounty_window_' + BountyWindow.feedId;
	var eventArr = [];
	var mContainer = {};
	var pContainer = {};
	var connection = null;
	var updater = null;
	var most_kills = 1;
	var first_event = null;
	
	BountyWindow.feedId++;
	
	_create();
	_createMemContainer();
	_createPlayerContainer();
	//_addPlayer(1);

// PRIVATE FUNCTIONS
	
	function _create(){
		console.log("wall_id:",wall_id," for tag:",tag);
		
		// connection status
		$(wall_id).append('<div></div>');
		$(wall_id + ' div:last').text("First Event:");
		$(wall_id + ' div:last').append('<input>');
		$(wall_id + ' input:last').attr("id", 'first_event');
		$(wall_id + ' input:last').attr("style", "width:7em");
		$(wall_id + ' input:last').attr("readonly", true);
		
		// create table
		$(wall_id).append('<table border="1px"></table>');
		$(wall_id + ' table:last').append('<thead></thead>');
		$(wall_id + ' thead:last').append('<tr> <th>Name</th><th>Kills</th><th id="bounty_debug1">debug1</th><th id="bounty_debug2">debug2</th> </tr>');
		$(wall_id + ' table:last').append('<tbody></tbody>');
		$(wall_id + ' tbody:last').attr("id", table_id.substring(1));
	}
	
	// Fetch all members in this outfit
	function _createMemContainer(){
		mContainer = new MemContainer({
			tag: tag, 
			onComplete: function() {
				//console.log("BountyWindow mContainer;", mContainer.getMemIdArr() );
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
			//console.log("kill_events:", kill_events);
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
			//console.log("e.timestamp:",e.timeStamp/1000000," e:",e);
			var msg = jQuery.parseJSON( e.data );
			if( msg.type != 'serviceStateChanged' ) {
				console.log("msg:", msg, ' timestamp:', (msg.payload!=null && msg.payload.timestamp!=null?msg.payload.timestamp:null), ' time:', Math.ceil(Date.now()/1000) );
				
				if( msg.subscription != null ) {
					if( msg.subscription.eventNames[0] == 'Death' && first_event == null) {
						
						first_event = new Date().getTime() / 1000;// seconds
						var hours = parseInt( first_event / 3600 ) % 24;
						hours = hours + 5;
						var minutes = parseInt( first_event / 60 ) % 60;
						var seconds = parseInt( first_event % 60 );

						var result = (hours < 10 ? "0" + hours : hours)
						+ ":" + (minutes < 10 ? "0" + minutes : minutes)
						+ ':' + (seconds < 10 ? "0" + seconds : seconds);
						
						$('#first_event').val(result);
						//$('#first_event').val(Math.ceil(Date.now()/1000));
					} else if ( false ) {// do something for login/out events initial msg
					
					}
				}
			}
			if( msg.service == 'event' && msg.type == 'serviceMessage' ) {
				_handleEvent( msg );
			}
		};/**/
		
		// check connection status
		//updater = setInterval( function(){
		
		//},2000);

	}
	
	function _handleEvent(msg){
		
		switch (msg.payload.event_name) {
			case 'Death':
				_handleDeathEvent(msg);
				break;
				
			case 'PlayerLogin':
				_handleLoginEvent(msg);
				break;
				
				
			case 'PlayerLogout':
				_handleLogoutEvent(msg);
				break;
				
			default:
				console.log("other event msg:",msg);
				break;
		
		}
	}
	
	function _handleLoginEvent(msg){
		console.log("_handleLoginEvent() msg:", msg);
		
		var id_temp = msg.payload.character_id;
		var ind = pContainer.indexOfId(id_temp)
		
		if( ind >= 0 ) {// logout is a murderer
			console.log("murderer logged on");
			$('#bounty_online_status_'+id_temp).html('<strong>online!</strong>');
		} else {
		
			console.log("member logged on");
		}
		
	}
	
	function _handleLogoutEvent(msg){
		console.log("_handleLogoutEvent() msg:", msg, 'id', msg.payload.character_id);
		
		var id_temp = msg.payload.character_id;
		var ind = pContainer.indexOfId(id_temp)
		
		if( ind >= 0 ) {// logout is a murderer
			console.log("murderer logged out");
			$('#bounty_online_status_'+id_temp).html('offline');
		} else {
		
			console.log("member logged out");
		}
	}
	
	function _handleDeathEvent(msg){
		//console.log("BountyWindow->_handleDeathEvent() msg=",msg);
		
		var victim_id = msg.payload.character_id;
		var attacker_id = msg.payload.attacker_character_id;
		
		if( mContainer.indexOfId(victim_id) >= 0) {// if member is victim
			if( mContainer.indexOfId(attacker_id) >= 0 ) {// member suicide
				console.log("MEMBER SUICIDE...");
			} else {// member is victim to other outfit
				console.log("MEMBER IS VICTIM!");
				var player_index = pContainer.indexOfId(attacker_id);
				if( player_index >= 0 ) {
					
				}
				_handleMemberVictimEvent(attacker_id, player_index);
			}
		} else {
			console.log("MEMBER KICKS ASS!");
			_handleMemberKillEvent(victim_id);
		}
	}
	
	function _handleMemberVictimEvent(id, p_index) {
		
		// store player in P_INFO
		P_INFO.addById(id, function() {// onComplete
			//WEP_INFO.addById(msg.payload.attacker_weapon_id, function() {// onComplete
				//VEH_INFO.addById(msg.payload.attacker_vehicle_id, function() {// onComplete
				
					// Generate ids
					var row_id = 'bounty_'+tag+"_"+id;//todo: change tag to feedId for multiple bountys of same outfit
					var row_kills_id = 'bounty_'+tag+"_kills_"+id;//todo: change tag to feedId
					
					var inserted = false;
					
					if( pContainer.indexOfId(id) < 0 ) {// new player
						pContainer.addById(id);
						_subscribeToLogin(id);
						
						// add Row To Table
						$(table_id).append('<tr class="bounty_table_row"> </tr>');
						$(table_id + ' tr:last').attr("id", row_id);
						$(table_id + ' tr:last').append('<td>'+P_INFO.getNameById(id)+'</td>');
						$(table_id + ' tr:last td:last').attr("class", 'bounty_name_cell');
						$(table_id + ' tr:last').append('<td>'+pContainer.getKillsById(id)+'</td>');
						$(table_id + ' tr:last td:last').attr("class", 'bounty_kills_cell');
						$(table_id + ' td:last').attr("id", row_kills_id);
						$(table_id + ' tr:last').append('<td>'+id+'</td>');
						$(table_id + ' tr:last').append('<td><strong>online</strong></td>');
						$(table_id + ' tr:last td:last').attr("id", 'bounty_online_status_'+id);
						//$(table_id).append('<tr> <td>Player</td><td>55</td> </tr>');
						//$(table_id).append('<tr> <td>Player</td><td>55</td> </tr>');
						
					} else {// existing player kill
						pContainer.addById(id);
						console.log("MEMBER IS VICTIM AGAIN!!!!");
						
						// Todo: Insertion sort instead of old way below
						var enemy_kills = pContainer.getKillsById(id);
						var enemy_name = P_INFO.getNameById(id);
						var enemy_name = P_INFO.getNameById(id);
						
						$(table_id+' > tr').each(function(i, row) {// foreach row
							//console.log("EACH i:",i );
							//console.log("EACH row:",row );
							//console.log("EACH find kills:",$(row).find('td.bounty_kills_cell').text() );
							//console.log("EACH find name:",$(row).find('td.bounty_name_cell').text() );
							
							var row_kills = $(row).find('td.bounty_kills_cell').text();
							//var row_enemy_id = ;//id=bounty_AOD_kills_5428011263316034385
							
							if( enemy_kills >= row_kills ) {
								//console.log( "q.replace? #row_id:", $('#'+row_id).attr('id') );
								//console.log( "q.replace?     row:", $(row).attr('id') );
								//console.log( "q.replace? if:", $('#'+row_id).attr('id') != $(row).attr('id') );
								if( $('#'+row_id).attr('id') != $(row).attr('id') ) {// don't insertBefore itself! it deletes itself
									$('#'+row_id).insertBefore(row);
								} else {
									//console.log( "INSERTED itself");
								}
								
								//console.log("INSERTED "+enemy_name+" WITH ",enemy_kills," kills. ");
								$('#'+row_kills_id).html(enemy_kills);
								inserted = true;
								return false;//break out of this loop
							}
							
						});
						if( !inserted ) {
							//console.log("INSERTED "+enemy_name+" WITH ",enemy_kills," kills at END. ");
							$(table_id).append('#'+row_id);
							//$('#'+row_id).insertBefore(row);
							$('#'+row_kills_id).html(enemy_kills);
						}
						
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
			
			// count table rows
			$('#bounty_debug2').html('count='+$(table_id+' tr').length);
		});
						
	}
	
	// called when an outfit member kills an enemy, 
	// so remove him from bounty list if needed
	function _handleMemberKillEvent(victim_id) {
		if( pContainer.indexOfId(victim_id) >= 0 ) {// existing enemy
		
			var row_id = 'bounty_'+tag+"_"+victim_id;//todo: change tag to feedId for multiple bountys of same outfit
			var row_kills_id = 'bounty_'+tag+"_kills_"+victim_id;//todo: change tag to feedId
			
			$('#'+row_kills_id).html(0);
			pContainer.setKillsById(victim_id, 0);
			$('#'+row_id).appendTo(table_id);
			
			console.log("REMOVE:",victim_id);
			
		}
		
		// count table rows
		$('#bounty_debug2').html('count='+$(table_id+' tr').length);
	}
	
	// Subscribe to member-murdering player for login/logout
	function _subscribeToLogin(player_id) {
		login_events = '{"service":"event","action":"subscribe","characters":["'+player_id+'"],"eventNames":["PlayerLogin","PlayerLogout"]}'
		
		connection.send(login_events);
	}
	
	
	// PRIVILEDGED FUNCTIONS
	//this.closeWin = _closeThis;// give public access to _closeThis() 
}

BountyWindow.feedId = 0;







