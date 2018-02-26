var reports = JSON.parse(rep);
var report = reports.benchmark
var report2 = reports.benchmark2
var stats = reports.statistics

var compareTwo = reports.benchmark2 != undefined

// LUTs
var os = {"macOS": "apple", "Windows": "windows", "Linux": "linux", "Android": "android"}
var hw = {"Desktop": "desktop", "Mobile": "mobile"}
var browser = {"Chrome": "chrome", "Chrome Mobile": "chrome", "Opera": "opera", "Safari": "safari", "Firefox": "firefox"}

console.log(reports)

$(document).ready(function(){
    addButtons(report)
    computeIcons()

    // load first available framework
    let fw = Object.keys(report.frameworks)
    fwClick(fw[0])

    myChart.data.datasets[0].label = "Benchmark " + report.id
    if(report2 != null) {
        myChart.data.datasets[1].label = "Benchmark " + report2.id
    } else {
        myChart.data.datasets[1].label = "Average"
        sdChart.data.datasets.splice(1, 1)
    }
    sdChart.update()
    myChart.update()
})

function getFrameworkData(json, framework) {
    let data = Object()
    if(json == null) return {}
    let keys = Object.keys(json.results)

    keys.forEach(function(e, i) {
        let results = Object.keys(json.results[e])
        
        results.forEach(function(n, j) {
            data[n] = json.results[e][n]
        })
    })

    return data
}

function fwClick(e) {
    setChartData(e)    
    setStdDevChart(e)

    // change button background colors
    let btns = document.getElementsByClassName("btn")

    for(let i = 0; i < btns.length; i++) {
        if(btns[i].value === e) {
            btns[i].style.backgroundColor = '#253042'
            btns[i].style.color = '#ff5b54'
            // TODO: mouseover color change
            btns[i].onmouseover
            // btns[i].style. 
        } else {
            btns[i].style.backgroundColor = 'inherit'
            btns[i].style.color = 'white'
        }
    }
}

function setChartData(e) {
    let data = getFrameworkData(report.frameworks[String(e)], String(e))
    let keys = Object.keys(data)
    myChart.data.datasets[0].data = Object.values(data)

    if(compareTwo) {
        let data2 = getFrameworkData(report2.frameworks[String(e)], String(e))
        myChart.data.datasets[1].data = keys.map(function(label) { return data2[label] })
    } else {
        let data2 = getFrameworkData(stats.frameworks[String(e)], String(e))
        myChart.data.datasets[1].data = keys.map(function(label) { return data2[label].avg })
    }

    myChart.options.title.text = e
    myChart.data.labels = keys
    myChart.update()
}

function setStdDevChart(e) {
    var data = getFrameworkData(report.frameworks[String(e)], String(e))
    var stat = getFrameworkData(stats.frameworks[String(e)], String(e))
    var keys = Object.keys(data)
    var zScores = computeZScores(keys, data, stat);

    sdChart.data.labels = keys
    sdChart.data.datasets[0].data = zScores

    if(compareTwo) {
        data = getFrameworkData(report2.frameworks[String(e)], String(e))
        zScores = computeZScores(keys, data, stat)
        sdChart.data.datasets[1].data = zScores
    }

    sdChart.update()
}

function computeZScores(keys, data, stat) {
    var zScores = keys.map(function(label) {
        let mean = stat[label].avg
        let sd = stat[label].stddev
        let val = data[label]
        return (val - mean)/sd
    })

    return zScores
}

function computeIcons() {
    $("#os").attr('class', "fa fa-" + os[report.operatingsystem] + " fa-3x");
    $("#hw").attr('class', "fa fa-" + hw[report.hardwaretype] + " fa-3x");
    $("#browser").attr('class', "fa fa-" + browser[report.browser] + " fa-3x");
    let date = new Date(report.timestamp)
    $("#ts").text("Timestamp: " + date)
}

function displayBenchmark(b) {
    myChart.data.datasets[b].hidden = !myChart.data.datasets[b].hidden;
    myChart.update()
    document.getElementsByClassName("togglebtn")[b].style.backgroundColor = myChart.data.datasets[b].hidden ? '#364554' :'#9CABBA'
}

function addButtons(report) {
    var keys = Object.keys(report.frameworks)

    for(var i = 0; i < keys.length; i++) {
        var $but = $('<button onclick="fwClick(value)" value="' + keys[i] + '" class="btn" type="button">'+ keys[i] + ' </button>')
        // add background color change on hover
        $but.hover(function() {

        })
        $but.appendTo((".btn-group"))
    }
}
