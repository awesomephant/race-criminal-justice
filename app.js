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
var formatDate, x, y, svg, height, width, xAxis, yAxis, line;
var init = function () {
    var margin = { top: 20, right: 50, bottom: 100, left: 50 };
    width = 900 - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;

    formatDate = d3.time.format("%Y");

    x = d3.time.scale()
        .range([0, width]);

    y = d3.scale.linear()
        .range([height, 0]);

    xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    line = d3.svg.line()
        .defined(function (d) { return d; })
        .x(function (d) { return x(d.year) })
        .y(function (d) { return y(d.value); });

    svg = d3.select("#stops").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
};

var updateData = function (area) {
    d3.json("../data/stop-and-searches/stops-and-searches-parse.json", function (error, data) {
        if (error) throw error;

        var Series = function (name) {
            this.name = name;
            this.values = [];
        };
        var series = [];

        var ethnicGroups = ['blackTotal', 'whiteTotal', 'asianTotal', 'total'];

        for (var i = 0; i < ethnicGroups.length; i++) {
            series.push(new Series(ethnicGroups[i]))
        }
        var calculateDifference = function (d, i) {
            var r = {
                'toWhite': (d.value / series[1].values[i].value).toFixed(1),
                'toAverage': (d.value / series[1].values[i].value).toFixed(1)
            }
            return r;
        }
        data.forEach(function (d, i) {
            d.year = formatDate.parse(d.year);
            for (var j = 0; j < ethnicGroups.length; j++) {
                series[j].values.push({
                    value: d.data[area][ethnicGroups[j]],
                    year: d.year
                })
            }
        });

        x.domain(d3.extent(data, function (d) { return d.year; }));
        y.domain([0, 250]);

        var black = series[0].values;
        var white = series[1].values;

        var g = svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        var group = svg.selectAll('.group')
            .data(series)
            .enter().append('g')
            .attr('class', function (d) { return 'series ' + d.name })

        console.log(series);

        group.append("path")
            .attr("class", "line")
            .attr("d", function (d) { return line(d.values); });

        group.selectAll('circle')
            .data(function (d) { return d.values; })
            .enter().append('circle')
            .attr('cx', function (d) { return x(d.year) })
            .attr('cy', function (d) { return y(d.value) })
            .attr('r', 4)

        legend = svg.append("g")
            .attr('class', 'legend')
            .attr('transform', 'translate(-40,' + (height + 50) + ')')

        legend.selectAll('g')
            .data(series)
            .enter().append('g')
            .attr("class", function (d) { return d.name })

        legend.selectAll('g').append("line")
            .attr('x1', 10)
            .attr('x2', 50)
            .attr('y1', function (d, i) { return 20 * i })
            .attr('y2', function (d, i) { return 20 * i })

        legend.selectAll('g').append('text')
            .text(function (d) { return d.name })
            .attr('x', 60)
            .attr('y', function (d, i) { return 20 * i + 3 })

        var differenceLine = group.selectAll(".difference")
            .data(black)
            .enter().append('g')
            .attr('class', 'difference')
            .append('line')
            .attr('x1', function (d) { return x(d.year) })
            .attr("y1", function (d) { return y(d.value) })
            .attr('x2', function (d) { return x(d.year) })
            .attr("y2", function (d, i) { return y(series[1].values[i].value) })

        var differenceText = group.selectAll(".difference")
            .append('text')
            .attr('class', 'difference-text')
            .attr('x', function (d) { return x(d.year) + 10 })
            .attr('y', function (d) { return y(d.value) + 20 })
            .text(function (d, i) {
                var d = calculateDifference(d, i);
                return d.toWhite + 'x';
            })
    });
}

d3.json("./data/areas.json", function (error, data) {
    if (error) throw error;

    var areaList = d3.select("#areas")

    areaList.selectAll('a')
        .data(data)
        .enter().append('a')
        .attr('href', function (d) { return '#' + d.replace(/[ .]/g, '-').toLowerCase() })
        .text(function (d) { return d })
        .on('click', function () {
            var h = d3.select(this).attr('href').slice(1);
            console.log(h)
            d3.select('svg').remove();
            init();
            updateData(h)
        })
})
document.addEventListener('DOMContentLoaded', function () {
    init()
    drawMap();
    if (window.location.hash) {
        updateData(window.location.hash.slice(1));
    } else {
        window.location.hash = '#england-and-wales'
        updateData(window.location.hash.slice(1));
    }

    document.addEventListener('mousemove', function (e) {
        var tip = document.getElementById('tooltip')
        var style = 'left: ' + (e.clientX - (tip.offsetWidth / 2)) + 'px;top:' + (e.clientY - 110) + 'px;' 
        tip.setAttribute('style', style)
    })
});

