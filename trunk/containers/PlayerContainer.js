/** 
	playerIdContainer.js
	Object that holds the NON-OUTFIT player id's and other info
	
	structure:
		{id: "12341234324", kills:"55"} }
**/

function PlayerContainer () {
	var self = this;
	var pArr = [];

	// PRIVATE FUNCTIONS
	function _add(item) {
		if (item.id != null || item.name != null || item.name_lower != null ) {
			pArr.push( item );// error check?
		} else {
			throw "Item is missing parameters: " + item;
		}
		//console.log("PCONT item:", item);
	}
	
	// PRIVILEDGED FUNCTIONS
	this.indexOfId = function(id) {
		var ind = -1;
		for( var i = 0; i < pArr.length; i++ ) {
			if( pArr[i].id != null && pArr[i].id == id ) {
				ind = i;
				break;
			}
		}
		return ind;
	}

	this.addById = function(id) {
		var ind = self.indexOfId( id );
		
		if( ind < 0 ) {
		
			_add( {
				id: id,
				kills: 1,
			});

		} else {
			pArr[ind].kills++;
		}
		//this.print();
		this.printDebug();
	}

	this.print = function() {
		console.log("PCONT arr:", pArr);
	}

	this.printDebug = function() {
		//console.log("PCONT arr:", pArr);
		$('#pArr').html('count='+pArr.length);
		
		for( var i = 0; i < pArr.length; i++) {
			$('#pArr').html( $('#pArr').html() + '<br>'+ JSON.stringify(pArr[i]) );
			
		}
	}

	this.getKillsById = function(id) {
		var ind = this.indexOfId(id);
		return pArr[ind].kills;
	}

	this.setKillsById = function(id, kills) {
		var ind = this.indexOfId(id);
		pArr[ind].kills = kills;
	}

	this.getKillsByIndex = function(ind) {
		return pArr[ind].kills;
	}
}









