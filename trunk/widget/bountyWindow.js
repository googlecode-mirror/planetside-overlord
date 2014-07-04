/** 
	bountyWindow.js
	Scans kills in past hour and determines if a bounty exists for your outfit.
**/
function BountyWindow (params) {
	var self = this;
	var tag = params.tag;
	var wall_id = '#' + params.wall_id;
	var window_id = '#bounty_window_' + BountyWindow.feedId;
	
	BountyWindow.feedId++;
	
	_create();

// PRIVATE FUNCTIONS
	
	function _create(){
		console.log("wall_id:",wall_id," for tag:",tag);
		$(wall_id).append('<table border="1px"></table>');
		$(wall_id + ' table:last').attr("id", window_id.substring(1));
		$(window_id).append('<tr> <th>Name</th><th>Kills</th> </tr>');
		//$(wall_id + ' span:last').attr("style", "display:inline; float:left; width:250px");
	}
	
	
	// PRIVILEDGED FUNCTIONS
	//this.closeWin = _closeThis;// give public access to _closeThis() 
}
BountyWindow.feedId = 0;







