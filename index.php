<!DOCTYPE HTML>
<html>

<head>
<meta charset="UTF-8">
<title>PS2 Kill</title>

<script type="text/javascript" language="Javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script>
<!--<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
<script type="text/javascript" language="Javascript" src="/bootstrap-3.2.0-dist/bootstrap-3.2.0-dist/js/bootstrap.js"></script>-->
<script src="utility/playerPedia.js"></script>
<script src="utility/weaponPedia.js"></script>
<script src="utility/vehiclePedia.js"></script>
<script src="containers/MemContainer.js"></script>
<script src="containers/PlayerContainer.js"></script>
<script src="outfitFeed.js"></script>
<script src="playerFeed.js"></script>
<script src="widget/outfitWindow.js"></script>
<script src="widget/playerWindow.js"></script>
<script src="utility/cookieHandler.js"></script>
<script src="utility/idConverter.js"></script>
<script src="widget/buttonHistory.js"></script>
<script src="widget/bountyWindow.js"></script>

<!-- DOJO CSS -->
<!----><link rel="stylesheet" href="../dojoprojects/dijit/themes/claro/claro.css" />
<!--<link rel="stylesheet" href="css/outfitSearch.css" type="text/css" />-->
<link rel="stylesheet" href="widget/player/PlyrWinMin.css" type="text/css" />
<link rel="stylesheet" href="widget/outfit/OutfitMon.css" type="text/css" />

<!-- FONTS -->
<link href='http://fonts.googleapis.com/css?family=Pathway+Gothic+One' rel='stylesheet' type='text/css'>
<link href='http://fonts.googleapis.com/css?family=Tulpen+One' rel='stylesheet' type='text/css'>
<link href='http://fonts.googleapis.com/css?family=Six+Caps' rel='stylesheet' type='text/css'>
<link href='http://fonts.googleapis.com/css?family=Ropa+Sans' rel='stylesheet' type='text/css'>
<script>
var feed;
var playerHistory;
var tagsHistory;
TIME = new Date();

$(document).ready(function(){
	//alert('Add logout and login event for bounty. First, Set offline when logout.');
	
	P_INFO.myPrint();
	WEP_INFO.myPrint();
	
	playerHistory = new buttonHistory({
		cookieName: 'pHistory',
		span_id: 'pHistory_list',
		onClick: function(name) {
			addPlayerFeed( name );
		}
	});/**/
	
	tagsHistory = new buttonHistory({
		cookieName: 'tHistory',
		span_id: 'tHistory_list',
		onClick: function(name) {
			addOutfitFeed( name );
		}
	});
	
	$('#init_merc_feed').click( function() {
		feed = addOutfitFeed('merc');
		$('#outfit_text_input').val( 'merc' );
	});
	
	$('#outfit_add').click( function() {
		feed = addOutfitFeed( $('#outfit_text_input').val());
		
	});
	
	$('#player_add').click( function() {
		feed = addPlayerFeed( $('#player_text_input').val());
	});
	
	$('#init_ratch_feed').click( function() {
		feed = addPlayerFeed( 'ratch' );
		$('#player_text_input').val( 'ratch' );
	});
	
	$('#button2').click( function() {
		feed = addOutfitFeed( 'merc');
		feed = addOutfitFeed( 'oo');
		feed = addOutfitFeed( '666');
		feed = addOutfitFeed( 'exe');		
		feed = addOutfitFeed( 'baid');		
	});
	
	$('#button3').click( function() {
		tagsHistory.clickAll();
	});
	
	$('#button4').click( function() {
		playerHistory.clickAll();
	});
	
	$('#button5').click( function() {
		tagsHistory.addButton('666');
	});
	
	// press enter on outfit_text_input
	$('#outfit_text_input').bind( "enterKey", function(e) {
		feed = addOutfitFeed( $('#outfit_text_input').val());
	});
	
	$('#outfit_text_input').keyup( function(e) {
		if( e.keyCode == 13 )	{
			$(this).trigger("enterKey");
		}
	});
	
	// press enter on player_text_input
	$('#player_text_input').bind( "enterKey", function(e) {
		feed = addPlayerFeed( $('#player_text_input').val());
	});
	
	$('#player_text_input').keyup( function(e) {
		if( e.keyCode == 13 )	{
			$(this).trigger("enterKey");
		}
	});
	
});



function addOutfitFeed(outfit_tag) {
	tagsHistory.addButton(outfit_tag);
	
	return new OutfitWindow({
		tag: outfit_tag,
		//wall_id: 'outfit_feed_wall'
		wall_id: 'player_feed_wall'
	});
}

function addBounty(outfit_tag) {
	//tagsHistory.addButton(outfit_tag);//todo make bounty tag history
	
	return new BountyWindow({
		tag: outfit_tag,
		//wall_id: 'outfit_feed_wall'
		wall_id: 'bounty_feed_wall'
	});
}

function addPlayerFeed(player_name) {
	playerHistory.addButton(player_name);
	
	return new PlayerWindow({
		pname: player_name,
		wall_id: 'player_feed_wall'
	});
}
</script>

</head>

<body class='interface_scifi'>    
	<!-- configure Dojo -->
    <script>
        // Instead of using data-dojo-config, we're creating a dojoConfig
        // object *before* we load dojo.js; they're functionally identical,
        // it's just easier to read this approach with a larger configuration.
        var dojoConfig = {
            // This code registers the correct location of the "demo"
            // package so we can load Dojo from the CDN whilst still
            // being able to load local modules
            async: true,
			//baseUrl: '../dojoprojects/',
            packages: [
				/*'dojo',
				'dijit',
				'dojox',*/
				//{ name: 'ps2', location: "../../ps2"},
				{ name: 'ps2', location: "/ps2"}//,
				//'demo'
            ]
        };
    </script>
     <!--load Dojo -->
    <script src="../dojoprojects/dojo/dojo.js"></script>
	<!--<script data-dojo-config="async: true" src="//ajax.googleapis.com/ajax/libs/dojo/1.9.3/dojo/dojo.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/dojo/1.8.5/dojo/dojo.js" data-dojo-config="async: true" ></script>-->
	
	<script>
		<!-- Tab Container -->
		require([
			"ps2/containers/FeedHeader",
			"ps2/containers/FeedDebug",
			"ps2/containers/FeedBody",
			"ps2/containers/FeedFooter",
			
			"dijit/layout/TabContainer", 
			"dijit/layout/ContentPane",
			"dijit/form/Button", 
			"dojo/dom", 
			"dojo/domReady!"
		], function(
			FeedHeader, 
			FeedDebug, 
			FeedBody, 
			FeedFooter, 
			
			TabContainer, 
			ContentPane, 
			Button,
			dom
		){
		
			dojo.byId('asdf');
		
			/*var main_header = new FeedHeader({
			
			}, "feed_main_header");
			main_header.startup();*/
		
			var main_debug = new FeedDebug({
			
			}, "feed_main_debug");
			main_debug.startup();
		
			var main_body = new FeedBody({
			
			}, "feed_main_body");
			main_body.startup();
		
			/*var main_footer = new FeedFooter({
			
			}, "feed_main_footer");
			main_footer.startup();*/
			
		});
	</script>
	
	<!-- Feed Main Body 
	<div id="feed_main_header"></div>-->
	<div id="feed_main_debug"></div>
	<div id="feed_main_body"></div>
	<!--<div id="feed_main_footer"></div>-->

</body>
</html>


