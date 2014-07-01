/** 
	vehiclePedia.js
	An container for holding any player info so that unnessasary api calls are avoided. 
	Also stores information that allow different functionality.
**/


var VehiclePedia = (function () {

  // Instance stores a reference to the Singleton
  var instance;

  function init() {

    // Singleton

    // Private methods and variables
    function privateMethod(){
        console.log( "I am private" );
    }/**/
	
	function _add(item) {
		//console.log("VEH_INFO _add(item:", item, ")");
		if (item.id != null && item.name != null && item.desc != null && item.image_path != null && item.image_id != null ) {
			pArr.push( item );// error check?
		} else {
			throw "Item is missing parameters: " + item;
		}
	}

    //var privateVariable = "Im also private";
    var pArr = [];
	
	// Constructor
	_add({// manually add veh id = 0
		id: '0',
		name: '',
		desc: '',
		image_id: '',
		image_path: ''// fix?
	});

    return {

		// Public methods and variables

		getFaction: function(player_id) {
		 
		},
		
		myPrint: function () {
			console.log("VEH_INFO myPrint() pArr:", pArr);
		},
		
		addById: function(id, onComplete) {
			//console.log("VEH_INFO addById(id:", id, ")");
			var self = this;
			if( this.indexOfId( id ) < 0 ) {
				$.ajax({
					type: "GET",
					dataType: "jsonp",
					url: 'http://census.soe.com/s:rch/get/ps2:v2/vehicle/?vehicle_id=' + id + '&c:show=vehicle_id,image_path,image_id,name.en,description.en',
					success: function(data){
						//console.log("VEH_INFO addById(id="+id+") ajax data:", data);
						_add( {
							id: id,
							name: data.vehicle_list[0].name.en,
							desc: data.vehicle_list[0].description.en,
							image_path: data.vehicle_list[0].image_path,
							image_id: data.vehicle_list[0].image_id,
							count: 0
						});
						//self.myPrint();
						onComplete();
					}
				});
			} else {// duplicate
				//console.log("VEH_INFO addById() SHOULD BE DUPLICATE id:", id);
				//self.myPrint();
				onComplete();
			}
		},

		indexOfId: function(weapon_id) {
			var ind = -1;
			for( var i = 0; i < pArr.length; i++ ) {
				if( pArr[i].id != null && pArr[i].id == weapon_id ) {
					ind = i;
					break;
				} 
			}
			return ind;
		},

		getNameByIndex: function(ind) {
			return pArr[ind].name;
		},

		// assumes already in pArr
		getNameById: function(id) {
			//console.log("VEH_INFO getNameById(id:", id, ")");
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

var VEH_INFO = VehiclePedia.getInstance();







