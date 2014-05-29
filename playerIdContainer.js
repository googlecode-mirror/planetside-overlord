/** 
	playerIdContainer.js
	Object that holds the NON-OUTFIT player id's associated with player name and name_lower
	
	structure:
		{id: "12341234324", name:'Ratch', name_lower:'ratch'} }
**/

//<script src="/dojoprojects/outfitEventFeed.js"></script>
function pInfo (params) {
	this.id = params.id;
	this.name = params.name;
	this.name_lower = params.name_lower;
}

function PlayerContainer () {
	this.parr = [];
	
}

PlayerContainer.prototype._add = function(item) {
	if (item.id != null || item.name != null || item.name_lower != null ) {
		this.parr.push( item );// error check?
	} else {
		throw "Item is missing parameters: " + item;
	}
	console.log("PCONT item:", item);
}

PlayerContainer.prototype.addById = function(id) {
	var self = this;
	if( this.indexOfId( id ) < 0 ) {
		$.ajax({
			type: "GET",
			dataType: "jsonp",
			url: 'http://census.soe.com/s:rch/get/ps2:v2/character/?character_id=' + id + '&c:show=name',
			success: function(data){
				name = data.character_list[0].name.first;
				self._add( {
					id: id,
					name: data.character_list[0].name.first,
					name_lower: data.character_list[0].name.first_lower,
				} );
				self.print();
			}
		});
	}
}

/**
	Since this is for other players, don't add an array, only add players as they come in as events.

PlayerContainer.prototype.addArrById = function(arr) {
	var self = this;
	
	for( var i = 0; i < arr.length; i++ ) {
		this.addById( arr[i] );// maybe should do single call to api instead of all
	}
	
}**/

PlayerContainer.prototype.indexOfId = function(id) {
	var ind = -1;
	for( var i = 0; i < this.parr.length; i++ ) {
		if( this.parr[i].id != null && this.parr[i].id == id ) {
			ind = i;
			break;
		}
	}
	return ind;
}

PlayerContainer.prototype.print = function(id) {
	console.log("PCONT arr:", this.parr);
}

PlayerContainer.prototype.getNameByIndex = function(ind) {
	return this.parr[ind].name;
}









