/** 
	feedInstance.js
	Holds a feed and determines layout.
**/
function Feed (params) {
	var self = this;
	var tag = params.tag;
	var wall_id = '#' + params.wall_id;
	var window_id = '#feed_' + Feed.feedId + '_window';
	var label_id = '#feed_' + Feed.feedId + '_label';
	var close_id = '#feed_' + Feed.feedId + '_close';
	var status_id = '#feed_' + Feed.feedId + '_status';
	var online_id = '#feed_' + Feed.feedId + '_online';
	var kd_id = '#feed_' + Feed.feedId + '_kd';
	var kills_id = '#feed_' + Feed.feedId + '_kills';
	var deaths_id = '#feed_' + Feed.feedId + '_deaths';
	var queue_id = '#feed_' + Feed.feedId + '_queue';
	var feed = {};
	
	_createElements();
	_createOutfitFeed();
	
	Feed.feedId++;
	

// PRIVATE FUNCTIONS
	function _createElements(){
		_createWindow();
		_createFields();
	}
	
	function _createWindow(){

		console.log("wall_id:",window_id," for tag:",tag);
		$(wall_id).append('<span></span>');
		$(wall_id + ' span:last').attr("id", window_id.substring(1));
		$(wall_id + ' span:last').attr("style", "display:inline; float:left; width:250px");
		console.log("created window_id:", window_id, " for tag:",tag);
	}
	
	function _createFields(){
	
		console.log("window_id:",window_id);
		
		// outfit label
		$(window_id).append('<span></span>');
		$(window_id + ' span:last').text("[" + tag + "]");
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
	
	function _createOutfitFeed(){

		feed = new OutfitFeed({
			tag: tag,
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
				feed.closeAll();// close connection
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
		feed.closeAll();// close connection
	});
}

Feed.feedId = 0;












