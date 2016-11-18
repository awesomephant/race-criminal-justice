var fs = require('fs');

var files = fs.readdir('./kml/', function (err, files) {
    var list = '';
    for (var i = 0; i < files.length; i++) {
        var filename = files[i].slice(0, -4)
        list += ' ./json/' + filename + '.json '
    }
    fs.writeFile('file-list.text', list, function (err) {
        console.log('Writing File list...')
    })
})