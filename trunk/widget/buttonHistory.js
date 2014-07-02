/** 
	playerHistory.js
	Saves players that have been monitored as a list of buttons.
	buttons = [ 
		{name:'Bob', name_lower:'bob', count:11},
		{name:'Ratch', name_lower:'ratch', count:11},
		...
		
	]
**/

function buttonHistory (params) {
// PRIVATE VARIABLES
	var self = this;
	var cookieName = params.cookieName;
	var span_id = '#' + params.span_id;
	var buttons = [];
	var id = 0;
	var onClick = params.onClick;
	
	_readCookie();
	//_updateCookie('ratch');
	//_createButton('ratch');// test add

// PRIVATE FUNCTIONS
	function _readCookie() {

		var Cookie = getCookie(cookieName);
		
		if( Cookie == null || Cookie == '' ) {
			buttons = [];
		} else {
			buttons = jQuery.parseJSON( Cookie );
		}

		_sortButtons();
		
		if( buttons != null && buttons.length > 0 ) {
			
			for(var i = 0; i < buttons.length; i++) {
				_createButton( buttons[i].pname );
			}
			setCookie(cookieName, JSON.stringify( buttons ) ,36500);// need to add to cookie 'tags'
			
		}/**/
	}

	function _updateCookie(pname) {

		if( _getCookieIndexOf(pname) < 0 ) {// new pname
		
			buttons.push({
				pname: pname,
				count: 1
			});
			setCookie(cookieName, JSON.stringify( buttons ) ,36500);// need to add to cookie 'tags'
		} else {// pname exists in cookie
			_incrementCountByName(pname);
		}

	}

	function _incrementCountByName(pname) {
	
		var ind = _getCookieIndexOf(pname);
		
		if( ind < 0 ) {// not found
			console.error("COOKIE pname:",pname, " not found but should exist!");
		} else {
			buttons[ind].count++;
			setCookie(cookieName, JSON.stringify( buttons ) ,36500);// need to add to cookie 'tags'
		}

	}

	function _getCookieIndexOf(pname) {

		var ind = -1;
		for( var i = 0; i < buttons.length; i++ ) {
			if ( buttons[i].pname == pname ) {
				ind = i;
				break;
			}
		}
		return ind;
			
	}

	function _sortButtons() {
		
		buttons.sort(function(a, b) {// sort history
			
			if (a.count > b.count) {
				return -1;
			}
			if (b.count > a.count) {
				return 1;
			}
			return 0;
		});
			
	}

	function _createButton(name) {
		$(span_id).append('<button></button>');
		//$(span_id + ' button:last').attr("id", 'tagCookie_' + id);
		$(span_id + ' button:last').attr("id", cookieName + '_' + id);
		//$(span_id + ' button:last').attr("class", 'tagCookie');
		$(span_id + ' button:last').text( name.toUpperCase() );
		$(span_id + ' button:last').attr("style", "width:"+ name.length+"em");
		
		$('#' + cookieName + '_' + id).click( function() {
			onClick(name);
			
		});
		
		id++;
	}

	// PRIVILEDGED FUNCTIONS
	this.addButton = function(name) {
		name = name.trim();
		if( _getCookieIndexOf(name) < 0 ) {// create only if new
			_createButton(name.toLowerCase());
		}
			_updateCookie(name.toLowerCase());
	}
	
	this.clickAll = function() {
		for( var i = 0; i < buttons.length; ++i ) {
			onClick(buttons[i].pname);
		}
	}
	
}

// PUBLIC FUNCTIONS
	
// STATIC VARIABLE












