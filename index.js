var DeviceAtlas = require('deviceatlas')  // angleman/deviceatlas
, conflate      = require('conflate') // Munge some objects together, deep by default. kommander/conflate.js
, util          = require('util')
, stream        = require('stream').Transform || require('readable-stream').Transform // stream 2 compatible
, cache         = {}
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

	DA = new DeviceAtlas(config);

	stream.call(self, { objectMode: true });

	self._transform = function (data, encoding, callback) {
		if (data) {
			var json   = data.toString('utf8');
			var parsed = JSON.parse(json);
			var ua = parsed[config.uaField];
			if (ua) { // useragent
				if (config.dropIpField) {
					delete parsed[config.uaField];
				}
				DA.device(ua, function(error, properties) {
					if (properties) {
						console.log(properties);
						parsed = conflate(parsed, properties);
						data = new Buffer(JSON.stringify(parsed), 'utf8');
					}
					self.push(data);
					callback();
				});
			} else {
				self.push(data);
				callback();
			}
		} else {
			self.push(data);
			callback();
		}
	};
}

 
util.inherits(DeviceAtlasStream, stream);
 
module.exports = DeviceAtlasStream;