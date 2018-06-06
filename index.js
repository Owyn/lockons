module.exports = function lockonsLight(dispatch) {
	let cache = {};
	var currentZone = -1;
	
	// If we enter a new zone, clear the cache
	dispatch.hook('S_LOAD_TOPO', 3, e=>{
		if(e.zone != currentZone)
			cache = {};
		currentZone = e.zone;
	});
	
	// Client wants to know if he(yes i just assumed the gender) can lockon to the target
	dispatch.hook('C_CAN_LOCKON_TARGET', 1, function(event) {
		if(cache[event.target.toString()])
			dispatch.toClient('S_CAN_LOCKON_TARGET', Object.assign({ ok: true }, event));
	});
	
	// We're getting information regarding the lockon status from the server
	dispatch.hook('S_CAN_LOCKON_TARGET', 1, function(event) {
		cache[event.target.toString()] = event.ok;
	});
};
