/*
	This file contains tools to convert different kinds of api id's into their respective human readable value.
	
	ex: API.getFaction(2);// returns "Vanu Sovereignty"
	ex: API.getFactionShort(2);// returns "VS"
*/

var API_Singleton = (function () {

  // Instance stores a reference to the Singleton
  var instance;

  function init() {

    // Singleton

    // Private methods and variables
    function privateMethod(){
        console.log( "I am private" );
    }

    //var privateVariable = "Im also private";

    return {

		// Public methods and variables

		 getFaction: function(faction_id) {
			switch (parseInt(faction_id, 10)) {
			case 1:
				return "New Conglomerate";
				break;
			case 2:
				return "Vanu Sovereignty";
				break;
			case 3:
				return "Terran Republic";
				break;
			default:
				return '';
				break;
			}
		},

		getFactionShort: function(faction_id) {
			console.log("fa:",faction_id);
			switch (parseInt(faction_id, 10)) {
			case 1:
				return "NC";
				break;
			case 2:
				return "VS";
				break;
			case 3:
				return "TR";
				break;
			default:
				return '';
				break;
			}
		}

		//publicProperty: "I am also public"
    };

  };

  return {

    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: function () {

      if ( !instance ) {
        instance = init();
      }

      return instance;
    }

  };

})();

var API = API_Singleton.getInstance();