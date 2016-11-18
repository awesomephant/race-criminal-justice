var csv = require('csv-parser')
var fs = require('fs')

var stream = csv({
    strict: false
});

var parseTable = function (cb) {
    var result = [];
    var filepath = 'stops-and-searches-2013-2014.csv';

    fs.createReadStream(filepath)
        .pipe(stream)
        .on('headers', function (headerList) {
            //   console.log(headerList)
        })
        .on('data', function (data) {
            if (data.area) {
                result.push(data.area)
            }
        })
        .on('end', function (err, data) {
            cb(err, result);
        })
}

var outputFile = 'areas.json'
var i = 4;

parseTable( function (err, data) {
    output = JSON.stringify(data);
    console.log('Writing areas');

    fs.writeFile(outputFile, output, function (err) {
        console.log('done')
    });
});