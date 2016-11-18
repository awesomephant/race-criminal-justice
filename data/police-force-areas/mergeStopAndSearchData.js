var fs = require('fs');

var geo = JSON.parse(fs.readFileSync('police-force-areas.json'))
var data = JSON.parse(fs.readFileSync('../stop-and-searches/stops-and-searches-parse.json', 'utf-8'))
data = data[4].data;

for (geoArea in geo.objects) {
    for (dataArea in data) {
        if (geoArea === dataArea) {
            geo.objects[geoArea].stops = data[dataArea];
            console.log('match found: ' + geoArea)
        }
    }
}

geo.objects['metropolitan'].stops = data['london']

fs.writeFileSync('geo-stops.json', JSON.stringify(geo));

