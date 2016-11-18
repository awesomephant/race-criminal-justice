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