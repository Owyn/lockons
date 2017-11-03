module.exports = function Lockons_light(dispatch) {
	
	let cache = [];
	let cache_size = 60;
	
	dispatch.hook('C_CAN_LOCKON_TARGET', function(event) {
		if(cache.includes(event.target.toString()))
		{
			dispatch.toClient('S_CAN_LOCKON_TARGET', Object.assign({ ok: true }, event));
		}
	});
	
	dispatch.hook('S_CAN_LOCKON_TARGET', function(event) {
		if(!cache.includes(event.target.toString()))
		{
			if(event.ok)
			{
				if(cache.length >= cache_size)
				{
					cache.pop();
				}
				cache.unshift(event.target.toString());
			}
		}
		else if(!event.ok) // cached object became untargetable
		{
			cache.splice(cache.indexOf(event.target.toString()), 1);
		}
	});
};
