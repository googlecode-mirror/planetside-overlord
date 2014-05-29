/** 
	feedInstance.js
	Holds a feed and determines layout.
**/
function playerFeedWindow (params) {
	var self = this;
	var pname = params.pname;
	var wall_id = '#' + params.wall_id;
	var window_id = '#pfeed_' + playerFeedWindow.feedId + '_window';
	var label_id = '#pfeed_' + playerFeedWindow.feedId + '_label';
	var close_id = '#pfeed_' + playerFeedWindow.feedId + '_close';
	var status_id = '#pfeed_' + playerFeedWindow.feedId + '_status';
	var online_id = '#pfeed_' + playerFeedWindow.feedId + '_online';
	var kd_id = '#pfeed_' + playerFeedWindow.feedId + '_kd';
	var kills_id = '#pfeed_' + playerFeedWindow.feedId + '_kills';
	var deaths_id = '#pfeed_' + playerFeedWindow.feedId + '_deaths';
	var queue_id = '#pfeed_' + playerFeedWindow.feedId + '_queue';
	var playerFeed = {};
	
	_createElements();
	_createPlayerFeed();
	
	playerFeedWindow.feedId++;
	

// PRIVATE FUNCTIONS
	function _createElements(){
		_createWindow();
		_createFields();
	}
	
	function _createWindow(){

		console.log("wall_id:",window_id," for pname:",pname);
		$(wall_id).append('<span></span>');
		$(wall_id + ' span:last').attr("id", window_id.substring(1));
		$(wall_id + ' span:last').attr("style", "display:inline; float:left; width:250px");
		console.log("created window_id:", window_id, " for pname:",pname);
	}
	
	function _createFields(){
	
		console.log("window_id:",window_id);
		
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
		$(window_id + ' div:last').attr("style", "height:250px; overflow:auto;");
		$(window_id + ' div:last').append('<table></table>');
		$(window_id + ' table:last').attr("id", queue_id.substring(1));
		
	}
	
	function _createPlayerFeed(){

		playerFeed = new PlayerFeed({
			pname: pname,
			label_id: label_id.substring(1),
			close_id: close_id.substring(1),
			feed_id: queue_id.substring(1),
			con_id: status_id.substring(1),
			totalM_id: online_id.substring(1),
			kdRatio_id: kd_id.substring(1),
			kills_id: kills_id.substring(1),
			deaths_id: deaths_id.substring(1)
		});
	}
	
	$(close_id).click( function() {
		// ugly code, but works, should use CSS transforms instead?
		/*$(window_id +','+window_id+' div' +','+window_id+' input' +','+window_id+' span' +','+window_id+' table').each(function(ix, obj) {
			$(obj).animate({
				opacity : 0, 
				left: '-='+$(obj).width()/4, 
				top: '-='+$(obj).height()/4,
				height:0, 
				width:0
			}, 
			200, 
			function() { 
				playerFeed.closeAll();// close connection
				$(window_id).remove(); 
			});
		});
		$(window_id).animate({
			'opacity' : 0,
			'width': 0, 
			'height': 0,
			'left': 0 + 'px',
			'top': 0 + 'px'
		});*/
		$(window_id).remove();
		playerFeed.closeAll();// close connection
	});
}

playerFeedWindow.feedId = 0;












