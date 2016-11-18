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

