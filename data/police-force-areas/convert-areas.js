var tj = require('togeojson'),
    fs = require('fs'),
    DOMParser = require('xmldom').DOMParser;


var files = fs.readdir('./kml/', function (err, files) {
    for (var i = 0; i < files.length; i++) {
        var file = './kml/' + files[i];
        var filename = files[i].slice(0, -4)

        console.log('reading ' + file + '...')
        var kml = new DOMParser().parseFromString(fs.readFileSync(file, 'utf8'));

        var converted = JSON.stringify(tj.kml(kml));
        fs.writeFile('./json/' + filename + '.json', converted, function (err) {
            console.log('Writing ' + filename + '...')
        })
    }
})

