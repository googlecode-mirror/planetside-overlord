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
	
	BountyWindow.feedId++;
	
	_create();
	_createMemContainer();
	_createPlayerContainer();
	//_addPlayer(1);

// PRIVATE FUNCTIONS
	
	function _create(){
		console.log("wall_id:",wall_id," for tag:",tag);
		$(wall_id).append('<table border="1px"></table>');
		$(wall_id + ' table:last').append('<thead></thead>');
		$(wall_id + ' thead:last').append('<tr> <th>Name</th><th>Kills</th> </tr>');
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
		console.log("BountyWindow->_handleEvent() msg=",msg);
		
		var victim_id = msg.payload.character_id;
		var attacker_id = msg.payload.attacker_character_id;
		
		if( mContainer.indexOfId(victim_id) >= 0 ) {// if member is victim
			console.log("MEMBER IS VICTIM!");
			_handleKillEvent(attacker_id);
		} else {
			console.log("MEMBER KICKS ASS!");
			_handleMemberKillEvent(victim_id);
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
						$(table_id).append('<tr class="bounty_table_row"> </tr>');
						$(table_id + ' tr:last').attr("id", row_id);
						$(table_id + ' tr:last').append('<td>'+P_INFO.getNameById(id)+'</td>');
						$(table_id + ' tr:last td:last').attr("class", 'bounty_name_cell');
						$(table_id + ' tr:last').append('<td>'+pContainer.getKillsById(id)+'</td>');
						$(table_id + ' tr:last td:last').attr("class", 'bounty_kills_cell');
						$(table_id + ' td:last').attr("id", row_kills_id);
						//$(table_id).append('<tr> <td>Player</td><td>55</td> </tr>');
						//$(table_id).append('<tr> <td>Player</td><td>55</td> </tr>');
						
					} else {// existing player kill
						pContainer.addById(id);
						
						
						// Todo: Insertion sort instead of old way below
						var enemy_kills = pContainer.getKillsById(id);
						
						$(table_id+' > tr').each(function(i, row) {
							console.log("EACH i:",i );
							console.log("EACH row:",row );
							console.log("EACH row.find:",$(row).find('td.bounty_kills_cell').text() );
							
							var row_kills = $(row).find('td.bounty_kills_cell').text();
							
							if( enemy_kills >= row_kills ) {
								console.log("INSERTED ENEMY WITH ",enemy_kills," kills. ");
								$('#'+row_id).insertBefore(row);
								$('#'+row_kills_id).html(enemy_kills);
								return false;//break out of this loop
							}
							
						});
						$('#'+row_kills_id).html(enemy_kills);
						
						/* // old way that only puts highest at top, and the rest are scattered
						if( pContainer.getKillsById(id) > most_kills ) {
							most_kills = pContainer.getKillsById(id);
							$('#'+row_id).prependTo(table_id);
						} else {
						
						}
						$('#'+row_kills_id).html(pContainer.getKillsById(id));
						*/
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
	}
	
	
	// PRIVILEDGED FUNCTIONS
	//this.closeWin = _closeThis;// give public access to _closeThis() 
}

BountyWindow.feedId = 0;







