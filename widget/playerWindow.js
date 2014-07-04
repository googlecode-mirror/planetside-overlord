/** 
	feedInstance.js
	Holds a feed and determines layout.
**/
function PlayerWindow (params) {
	var self = this;
	var pname = params.pname.toLowerCase().trim();
	var wall_id = '#' + params.wall_id;
	var window_id = '#pfeed_' + PlayerWindow.feedId + '_window';
	var label_id = '#pfeed_' + PlayerWindow.feedId + '_label';
	var videoButton_id = '#pfeed_' + PlayerWindow.feedId + '_videoButton';
	var feedDiv_id = '#pfeed_' + PlayerWindow.feedId + '_feedDiv';
	var close_id = '#pfeed_' + PlayerWindow.feedId + '_close';
	var status_id = '#pfeed_' + PlayerWindow.feedId + '_status';
	var online_id = '#pfeed_' + PlayerWindow.feedId + '_online';
	var kd_id = '#pfeed_' + PlayerWindow.feedId + '_kd';
	var kills_id = '#pfeed_' + PlayerWindow.feedId + '_kills';
	var deaths_id = '#pfeed_' + PlayerWindow.feedId + '_deaths';
	var queue_id = '#pfeed_' + PlayerWindow.feedId + '_queue';
	var playerFeed = {};
	
	_createElements();
	_createPlayerFeed();
	
	PlayerWindow.feedId++;
	

// PRIVATE FUNCTIONS
	function _createElements(){
		_createWindow();
	}
	
	function _createWindow(){

		//console.log("wall_id:",window_id," for pname:",pname);
		$(wall_id).append('<span></span>');
		$(wall_id + ' span:last').attr("id", window_id.substring(1));
		$(wall_id + ' span:last').attr("class", 'window');
		//console.log("created window_id:", window_id, " for pname:",pname);
	}
	
	function _createFields(data){
	
		//console.log("playerWindow.js _createFields() data:",data);
		
		// outfit label
		$(window_id).append('<span></span>');
		$(window_id + ' span:last').text( pname );
		$(window_id + ' span:last').attr("id", label_id.substring(1));
		//$(window_id + ' input:last').attr("style", "display:inline-block; text-align: center;");
		
		// close button
		$(window_id).append('<button>X</button>');
		$(window_id + ' button:last').attr("id", close_id.substring(1));
		$(window_id + ' button:last').attr("class", "window_class");
		$(window_id + ' button:last').attr("style", "float:right;" );
		
		// video button
		$(window_id).append('<button>V</button>');
		$(window_id + ' button:last').attr("id", videoButton_id.substring(1));
		$(window_id + ' button:last').attr("class", "window_class");
		$(window_id + ' button:last').attr("style", "float:right;" );
		
		// connection status
		$(window_id).append('<div></div>');
		$(window_id + ' div:last').text("Status:");
		$(window_id + ' div:last').append('<input>');
		$(window_id + ' input:last').attr("id", status_id.substring(1));
		$(window_id + ' input:last').attr("style", "width:7em");
		$(window_id + ' input:last').attr("readonly", true);
		
		// members online
		$(window_id).append('<div></div>');
		$(window_id + ' div:last').text("Online:");
		$(window_id + ' div:last').append('<input>');
		$(window_id + ' input:last').attr("id", online_id.substring(1));
		$(window_id + ' input:last').attr("style", "width:7em");
		$(window_id + ' input:last').attr("readonly", true);
		$(window_id + ' input:last').val(data.online_status);
		
		// kill/death ratio
		$(window_id).append('<span></span>');
		$(window_id + ' span:last').text("K/D:");
		$(window_id + ' span:last').append('<input>');
		$(window_id + ' input:last').attr("id", kd_id.substring(1));
		$(window_id + ' input:last').attr("style", "width:3em");
		$(window_id + ' input:last').attr("readonly", true);
		
		// total kills
		$(window_id).append('<span></span>');
		$(window_id + ' span:last').text("K:");
		$(window_id + ' span:last').append('<input>');
		$(window_id + ' input:last').attr("id", kills_id.substring(1));
		$(window_id + ' input:last').attr("style", "width:3em");
		$(window_id + ' input:last').attr("readonly", true);
		
		// total deaths
		$(window_id).append('<span></span>');
		$(window_id + ' span:last').text("D:");
		$(window_id + ' span:last').append('<input>');
		$(window_id + ' input:last').attr("id", deaths_id.substring(1));
		$(window_id + ' input:last').attr("style", "width:3em");
		$(window_id + ' input:last').attr("readonly", true);
	
		// Feed list
		$(window_id).append('<div></div>');
		$(window_id + ' div:last').attr("id", feedDiv_id.substring(1));
		$(window_id + ' div:last').attr("style", "height:250px; overflow:auto;");
		$(window_id + ' div:last').append('<table></table>');
		$(window_id + ' table:last').attr("id", queue_id.substring(1));
		
		//if( data.online_status == '1' ) {
			var faction = API.getFactionShort( data.faction_id ) ;
			//console.log("data.:",data);
			$(window_id).attr("class", 'window ' + faction );
		//} else { // offline
		//	$(window_id).attr("class", 'window offline');
		//}
	}
	
	function _createPlayerFeed(){

		playerFeed = new PlayerFeed({
			pname: pname,
			label_id: label_id.substring(1),
			close_id: close_id.substring(1),
			feed_id: queue_id.substring(1),
			con_id: status_id.substring(1),
			online_id: online_id.substring(1),
			kdRatio_id: kd_id.substring(1),
			kills_id: kills_id.substring(1),
			deaths_id: deaths_id.substring(1),
			onInfoComplete: function (data) {// 'data' is character info
				//console.log("playerFeed onInfoComplete() data:",data);
				_createFields(data);
				_createButtonHandles();
			},
			onSocketOpen: function () {
				//console.log("playerFeed onSocketOpen()");
			}
		});
	}	
	
	function _createButtonHandles(){
	
		$(close_id).click( function() {
			$(window_id).remove();
			playerFeed.closeAll();// close connection
		});

		$(videoButton_id).click( function() {
			//console.log("videoButton_id).click()");
			//$(queue_id).remove();
			//$(feedDiv_id).append('<div id="video_wall2" style="background-color:#EDEDED; "><object type="application/x-shockwave-flash" height="170"  width="250" id="live_embed_player_flash" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel=hondadude7" bgcolor="#000000"><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.twitch.tv&channel=hondadude7&auto_play=true&start_volume=25" /></object>');
		});
	}
	
	function _closeThis() {
		$(window_id).remove();
		feed.closeAll();// close connection
	}
	
	// PRIVILEDGED FUNCTIONS
	this.closeWin = _closeThis;// give public access to _closeThis() 
}

PlayerWindow.feedId = 0;
PlayerWindow.allWindows = [];
PlayerWindow.closeAll = function () {
	console.log("allWindows:", PlayerWindow.allWindows);
	for(var i = 0; i < PlayerWindow.allWindows.length;  ++i ) {
		PlayerWindow.allWindows[i].closeWin();
	}
}












