module.exports = function Lockons_light(dispatch) {
	
	let cache = [];
	let cache_size = 60;
	
	dispatch.hook('C_CAN_LOCKON_TARGET', function(event) {
		if(cache.includes(event.target))
		{
			dispatch.toClient('S_CAN_LOCKON_TARGET', Object.assign({ ok: true }, event));
			console.log("using cached lockOn state" +event.target + " and unk: " + event.unk);
		}
	});
	
	dispatch.hook('S_CAN_LOCKON_TARGET', function(event) {
		if(!cache.includes(event.target))
		{
			if(event.ok)
			{
				if(cache.length >= cache_size)
				{
					cache.pop();
					console.log("cache max size reached");
				}
				cache.unshift(event.target);
				console.log("adding new element to cache: " +event.target + " and unk: " + event.unk);
			}
		}
		else if(!event.ok) // cached object became untargetable
		{
			cache.splice(cache.indexOf(event.target), 1);
			console.log("cached element became untargetable" +event.target + " and unk: " + event.unk);
		}
	});
};
