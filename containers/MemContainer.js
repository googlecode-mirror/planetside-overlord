/** 
	outfitSearch.js
	Container for storing OUTFIT members array of player_names and ID
**/

// CONSTRUCTOR: Parameter is outfit tag
function MemContainer (params) {
	var self = this;
	this.data = {};// outfit information
	this.memArr = [];
	this.onlineCount = 0;
	var tag = params.tag.toLowerCase() ;
	var onComplete = params.onComplete;
	//console.log("OUTFIT params.tag:", tag);

	var url = 'https://census.soe.com/s:rch/get/ps2:v2/outfit/?alias_lower='+tag+'&c:resolve=member_character(name,type.faction)&c:resolve=member_online_status&c:resolve=leader'
	//console.log("OUTFIT url=", url);
	
	$.ajax({ // get member data
		type: "GET",
		dataType: "jsonp",
		url: url,
		success: function(data){
			self.data = data;
			console.log("OUTFIT GET data=", self.data);
			self.memArr = self.createMemArr( self.data.outfit_list[0].members );
			if (typeof onComplete === "function") {
				onComplete(data);
			} else {
				throw "onComplete is not a function!";
			}
		}
	});
}

// Create simple array of {id, name, name_lower} (TODO: OPTIMIZE TO ONLINE MEMBERS ONLY)
MemContainer.prototype.createMemArr = function(members) {
	//console.log("OUTFIT createMemArr members=", members);
	var arr = [];
	
	for( var i = 0; i < members.length; i++ ) {
		if( members[i].name != null ) {
			arr.push({
				id: members[i].character_id,
				name: members[i].name.first,
				name_lower: members[i].name.first_lower,
				isOnline: members[i].online_status
			});
		}
		if( members[i].online_status != '0' ) {
			this.onlineCount++;
		}
	}
	//console.log("OUTFIT  memArr=", arr);
	return arr;
}

// pass this into wss stream request
MemContainer.prototype.getMemIdArr = function() {
	var ids = [];
	for( var i = 0; i < this.memArr.length; i++ ) {
		ids.push( '"'+this.memArr[i].id+'"' );
	}
	console.log("OUTFIT getMemIdArr ids:"+ ids);
	return ids;
}

// returns the index of the member id, -1 if not found
MemContainer.prototype.indexOfId = function(id) {
	var ind = -1;
	for( var i = 0; i < this.memArr.length; i++ ) {
		if ( this.memArr[i].id == id ) {
			ind = i;
			break;
		}
	}
	return ind;
}


MemContainer.prototype.getTagNormal = function() {
	if( this.data.outfit_list[0].alias != null ) {
		return this.data.outfit_list[0].alias;
	} else {
		console.error("Outfit tag is null!");
	}
}


