var DA      = require('deviceatlas')  // angleman/deviceatlas
, conflate  = require('conflate') // Munge some objects together, deep by default. kommander/conflate.js
, util      = require('util')
, stream    = require('stream').Transform || require('readable-stream').Transform // stream 2 compatible
, cache     = {}
;


// json string in and out
function DeviceAtlasStream(config) {
	var self = this;

	var defaults = {
		memoryCache:     true, 
		uaField:         'ua',
		dropUaField:     false
	}

	config = (config) ? conflate(defaults, config) : defaults;

	maxmind.init(config.dataPath, config);

	stream.call(self, { objectMode: true });

	self._transform = function (data, encoding, callback) {
		if (data) {
			var json   = data.toString('utf8');
			var parsed = JSON.parse(json);
			var ip = parsed[config.ipField];
			if (ip) { // ip field found
				if (config.dropIpField) {
					delete parsed[config.ipField];
				}
				var location = maxmind.getLocation(ip);
				if (location) {
					parsed = conflate(parsed, location);
					data = new Buffer(JSON.stringify(parsed), 'utf8');
				}
			}
		}
		self.push(data);
		callback();
	};
}

 
util.inherits(DeviceAtlasStream, stream);
 
module.exports = DeviceAtlasStream;