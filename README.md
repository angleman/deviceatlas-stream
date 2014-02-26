# deviceatlas-stream

Device Atlas stream adds [Device Atlas](http://deviceatlas.com) device details to a JSON string stream based upon a select user agent field.
[Device Atlas](http://deviceatlas.com) is a database of mobile device information. The official API is available at http://deviceatlas.com/downloads. Unfortunately, there isn't an official API for Node or Javascript. Uses readable-stream for node < 0.10 to ensure stream2+ sanity.


## Install

```bash
npm install deviceatlas-stream
```

A copy of your [Device Atlas data](https://deviceatlas.com/resources/getting-the-data)

## Usage

Sample ```logfile.json``` line:

```js
{"timestamp":"2014-02-24 10:29:42", "ua":"SonyEricssonW850i/R1GB Browser/NetFront/3.3 Profile/MIDP-2.0 Configuration/CLDC-1.1"}
```

```js
var fs        = require('fs');
var logstream = fs.createReadStream('logfile.json');
var split     = new require('split')();
var DaStream  = require('deviceatlas-stream');
var das       = new DaStream({
	dataPath:    'DeviceAtlas.json',
	memoryCache: true,               // default
	uaField:     'ua',               // default
	dropUaField: false               // default
});

logstream
.pipe(split)
.pipe(das)
.pipe(process.stdout) // { "timestamp": ..., , ...}
```

## License 

### MIT

Licenses of dependancies may vary.
