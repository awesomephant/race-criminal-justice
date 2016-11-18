var test, testuk;

var drawMap = function () {
    var width = 600,
        height = 800;

    var colors = ["#6CC0F0", "#FFD240"];

    var color = d3.scale.linear()
        .domain([1, 10])
        .range(colors);

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr('class', 'map-svg');

    d3.json("./data/police-force-areas/geo-stops.json", function (error, uk) {
        if (error) return console.error(error);
        testuk = uk;
        var projection = d3.geo.albers()
            .center([0, 55.4])
            .rotate([4.4, 0])
            .parallels([50, 60])
            .scale(6500)
            .translate([120, 60]);

        var path = d3.geo.path()
            .projection(projection);

        for (var key in uk.objects) {
            var subunits = topojson.feature(uk, uk.objects[key]);

            svg.append("path")
                .datum(subunits)
                .attr("d", path)
                .attr('class', 'police-area')
                .attr('data-area', key)
                .attr('data-difference', function () {
                    if (uk.objects[key].stops) {
                        return (uk.objects[key].stops.blackTotal / uk.objects[key].stops.whiteTotal).toFixed(1)
                    }
                })
                .attr('style', function () {
                    if (uk.objects[key].stops) {
                        return 'fill: ' + color(uk.objects[key].stops.blackTotal / uk.objects[key].stops.whiteTotal)
                    } else {
                        return 'undefined';
                    }
                })
                .on('mouseover', function () {
                    var t = d3.select(this);
                    var tip = d3.select('#tooltip');
                    d3.select('#map').attr('data-tooltip-active', 'true')
                    tip.select('h3').text(t.attr('data-area').replace('-', ' '))
                    tip.select('p').html('<em>' + t.attr('data-difference') + '</em> times more likely to be stopped and searched than a white person')
                })
                .on('mouseout', function () {
                    d3.select('#map').attr('data-tooltip-active', 'false')
                })
        }
        var gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "gradient")
            .attr("spreadMethod", "pad");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", colors[0])
            .attr("stop-opacity", 1);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", colors[1])
            .attr("stop-opacity", 1);

        var legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', 'translate(' + (width - 200) + ',' + (height - 140) + ')')

        legend.append('rect')
            .attr('fill', 'url(#gradient)')
            .attr('width', '120px')
            .attr('height', '12px')

        legend.append('text')
            .attr('transform', 'translate(0,' + 25 + ')')
            .text('1x')

        legend.append('text')
            .attr('transform', 'translate(' + 100 + ',' + 25 + ')')
            .text('15x')

    });
}