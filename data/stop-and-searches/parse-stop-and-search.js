var csv = require('csv-parser')
var fs = require('fs')

var stream = csv({
    strict: false
});

var Area = function (data) {
    this.whiteTotal = data['White -Total'] || data['White'];
    this.blackTotal = data['Black - Total'] || data['Black'];
    this.asianTotal = data['Asian - Total'] || data['Asian'];
    this.mixedTotal = data['Mixed - Total'] || data['Mixed'];
    this.total = data['Total'];
}

var parseTable = function (year, cb) {
    var result = {};
    var filepath = 'stops-and-searches-' + year + '.csv';

    fs.createReadStream(filepath)
        .pipe(stream)
        .on('headers', function (headerList) {
            //   console.log(headerList)
        })
        .on('data', function (data) {
            if (data.area) {
                result[data.area.replace(/[ .]/g, '-').toLowerCase()] = new Area(data);
            }
        })
        .on('end', function (err, data) {
            cb(err, result);
        })
}

var years = [
    '2007-2008',
    '2008-2009',
    '2009-2010',
    '2011-2012',
    '2013-2014'
];

var outputFile = 'stops-and-searches-parse.json'
var i = 4;

parseTable(years[i], function (err, data) {
    var output = {};
    output.year = years[i].slice(5,9);
    output.data = data;
    
    output = JSON.stringify(output) + ',';
    console.log('Writing data for ' + years[i]);
    
    fs.appendFile(outputFile, output, function (err) {
        console.log('done')
    });
});