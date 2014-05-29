/** 
	cookieHandler.js
	Handles browser cookies.
**/

function setCookie(cname,cvalue,exdays)
{
	var d = new Date();
	d.setTime(d.getTime()+(exdays*24*60*60*1000));
	var expires = "expires="+d.toGMTString();
	document.cookie = cname+"="+cvalue+"; "+expires;
}

function getCookie(cname) {

	var name = cname + "=";
	var ca = document.cookie.split(';');
	
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name)==0) {
			return c.substring(name.length,c.length);
		}
	}
	
	return "";
}

function printCookies() {

	console.log("COOKIE document.cookie:", document.cookie );
	
}

function checkTagCookie(tag) {

	//if( cookiesJSON.indexOf(tag) < 0 ) {// new tag
	if( getCookieIndexOf(tag) < 0 ) {// new tag
	
		cookiesJSON.push({
			tag: tag,
			count: 1
		});
		setCookie("tags", JSON.stringify( cookiesJSON ) ,36500);// need to add to cookie 'tags'
		createHistoryButton(tag);
	} else {// tag exists in cookie
		incrementCountByTag(tag);
	}

}

function createHistoryButton(tag) {

	$('#history_list').append('<button></button>');
	$('#history_list' + ' button:last').attr("id", 'tagCookie_' + CookieId);
	$('#history_list' + ' button:last').text( tag.toUpperCase() );
	$('#history_list' + ' button:last').attr("style", "width:4em");
	
	$('#' + 'tagCookie_' + CookieId).click( function() {
		feed = addFeed( tag );
		
	});
	
	CookieId++;
}

function addHistoryButtons() {

	var tagsCookie = getCookie('tags');
	
	if( tagsCookie == null || tagsCookie == '' ) {
		cookiesJSON = [];
	} else {
		cookiesJSON = jQuery.parseJSON( tagsCookie );
	}

	sortCookiesJSON();
	
	//console.log("COOKIE cookiesJSON sorted*:", cookiesJSON );
	//console.log("COOKIE getCookie('tags'):", getCookie('tags') );
	
	if( cookiesJSON != null && cookiesJSON.length > 0 ) {
		
		for(var i = 0; i < cookiesJSON.length; i++) {
			createHistoryButton( cookiesJSON[i].tag );
		}
		setCookie("tags", JSON.stringify( cookiesJSON ) ,36500);// need to add to cookie 'tags'
		
	}
}

function getCookieIndexOf(tag) {

	var ind = -1;
	for( var i = 0; i < cookiesJSON.length; i++ ) {
		if ( cookiesJSON[i].tag == tag ) {
			ind = i;
			break;
		}
	}
	return ind;
		
}

function incrementCountByTag(tag) {
	
	var ind = getCookieIndexOf(tag);
	
	if( ind < 0 ) {// not found
		console.error("COOKIE tag:",tag, " not found but should exist!");
	} else {
		cookiesJSON[ind].count++;
		setCookie("tags", JSON.stringify( cookiesJSON ) ,36500);// need to add to cookie 'tags'
	}
		
}

function sortCookiesJSON() {
	
	cookiesJSON.sort(function(a, b) {// sort history
		
		if (a.count > b.count) {
			return -1;
		}
		if (b.count > a.count) {
			return 1;
		}
		return 0;
	});
		
}


var cookiesJSON = [];// [ {tag:'merc',count:11}, {tag:'merc',count:11} ]
var CookieId = 0;















