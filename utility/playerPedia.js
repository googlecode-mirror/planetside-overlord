/** 
	playerPedia.js
	An container for holding any player info so that unnessasary api calls are avoided. 
	Also stores information that allow different functionality.
**/


var PlayerPedia = (function () {

  // Instance stores a reference to the Singleton
  var instance;

  function init() {

    // Singleton

    // Private methods and variables
    function privateMethod(){
        console.log( "I am private" );
    }/**/
	
	function _add(item) {
		//console.log("P_INFO _add(item:", item, ")");
		if (item.id != null && item.name != null && item.name_lower != null ) {
			pArr.push( item );// error check?
		} else {
			throw "Item is missing parameters: " + item;
		}
	}

    //var privateVariable = "Im also private";
    var pArr = [];

    return {

		// Public methods and variables

		getFaction: function(player_id) {
		 
		},
		
		myPrint: function () {
			console.log("P_INFO myPrint() pArr:", pArr);
		},
		
		addById: function(id, onComplete) {
			//console.log("P_INFO addById(id:", id, ")");
			var self = this;
			if( this.indexOfId( id ) < 0 ) {
				$.ajax({
					type: "GET",
					dataType: "jsonp",
					url: 'http://census.soe.com/s:rch/get/ps2:v2/character/?character_id=' + id + '&c:show=name',
					success: function(data){
						//console.log("P_INFO addById() ajaxL data:", data);
						if( data.character_list[0] != null ) {
							name = data.character_list[0].name.first;
							_add( {
								id: id,
								name: data.character_list[0].name.first,
								name_lower: data.character_list[0].name.first_lower,
								count: 0
							} );
							//self.myPrint();
							onComplete();
						} else {
							console.error("data.character_list[0] is null! id = ",id, " data=",data);
						}
					}
				});
			} else {// duplicate
				//console.log("P_INFO addById() SHOULD BE DUPLICATE id:", id);
				//self.myPrint();
				onComplete();
			}
		},

		indexOfId: function(player_id) {
			var ind = -1;
			for( var i = 0; i < pArr.length; i++ ) {
				if( pArr[i].id != null && pArr[i].id == player_id ) {
					ind = i;
					break;
				} 
			}
			return ind;
		},

		/*getNameByIndex: function(ind) {
			return pArr[ind].name;
		},*/

		getNameById: function(id) {
			//console.log("P_INFO getNameById(id:", id, ")");
			pArr[this.indexOfId(id)].count++;
			return pArr[this.indexOfId(id)].name;
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

var P_INFO = PlayerPedia.getInstance();







