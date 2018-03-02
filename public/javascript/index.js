var reports = JSON.parse(rep);
var report = reports.benchmark
var report2 = reports.benchmark2
var stats = reports.statistics
var selectedFramework = ""
var compareTwo = reports.benchmark2 != undefined

// LUTs
var os = {"macOS": "apple", "Windows": "windows", "Linux": "linux", "Android": "android"}
var hw = {"Desktop": "desktop", "Mobile": "mobile"}
var browser = {"Chrome": "chrome", "Chrome Mobile": "chrome", "Opera": "opera", "Safari": "safari", "Firefox": "firefox", "Microsoft Edge":"edge"}

console.log(reports)

$(document).ready(function(){
    addButtons(report)
    computeIcons()
    computeScores()
    // load first available framework
    let fw = Object.keys(report.frameworks)
    fwClick(fw[0])

    myChart.data.datasets[0].label = "Benchmark " + report.id
    sdChart.data.datasets[0].label = "Benchmark " + report.id
    percentileChart.data.labels[0] = "Benchmark " + report.id

    if(report2 != null) {
        myChart.data.datasets[1].label = "Benchmark " + report2.id
        sdChart.data.datasets[1].label = "Benchmark " + report2.id
        percentileChart.data.labels[1] = "Benchmark " + report2.id
    } else {
        myChart.data.datasets[1].label = "Average"
        sdChart.data.datasets.splice(1, 1)
    }

    sdChart.update()
    myChart.update()
    percentileChart.update()
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
    setPercentileChart(e)
    selectedFramework = e
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

function setPercentileChart(e) {
    percentileChart.data.datasets[0].data[0] = report.frameworks[e].percentile * 100

    if(compareTwo) {
        percentileChart.data.datasets[0].data[1] = report2.frameworks[e].percentile * 100
    }
    else {
        percentileChart.data.datasets[0].data.splice(1, 1)
        percentileChart.data.labels.splice(1, 1)
    }

    percentileChart.update()
}

function setChartData(e) {
    let data = getFrameworkData(report.frameworks[String(e)], String(e))
    let keys = Object.keys(data)

    myChart.data.datasets[0].data = keys.map(function(label) { return data[label].result.toFixed(4) })

    if(compareTwo) {
        let data2 = getFrameworkData(report2.frameworks[String(e)], String(e))
        myChart.data.datasets[1].data = keys.map(function(label) { return data2[label].result.toFixed(4) })
    } else {
        let data2 = getFrameworkData(stats.frameworks[String(e)], String(e))
        myChart.data.datasets[1].data = keys.map(function(label) { return data2[label].avg.toFixed(4) })
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
        let val = data[label].result
        return ((val - mean)/sd).toFixed(2)
    })

    return zScores
}

function computeIcons() {
    var align = compareTwo ? " report1icon" : " reporticon"
    var size = compareTwo ? "fa-2x" : "fa-3x"

    $("#os").attr('class', "fa fa-" + os[report.operatingsystem] + " " + size + align);
    $("#hw").attr('class', "fa fa-" + hw[report.hardwaretype] + " " + size + align);
    $("#browser").attr('class', "fa fa-" + browser[report.browser] + " " + size + align);

    if(compareTwo) {
        var $os2 = $('<i id="os2" class="fa fa-' + os[report2.operatingsystem] + ' ' + size + ' report2icon" aria-hidden="true"></i>')
        var $hw2 = $('<i id="hw2" class="fa fa-' + hw[report2.hardwaretype] + ' ' + size + ' report2icon" aria-hidden="true"></i>')
        var $browser2 = $('<i id="browser2" class="fa fa-' + browser[report2.browser] + ' ' + size + ' report2icon" aria-hidden="true"></i>')
        $os2.appendTo("#os-div")
        $hw2.appendTo("#hw-div")
        $browser2.appendTo("#browser-div")
    }

    let date = new Date(report.timestamp)
    $("#ts").text("Timestamp: " + date)
}

function computeScores() {
    var scr = Object.keys(report.frameworks).reduce(function(acc, framework) {
        return acc + parseFloat(report.frameworks[framework].percentile * 100)
    }, 0)
    scr /= Object.keys(report.frameworks).length
    
    document.getElementById("score1").innerHTML = scr

    if(compareTwo) {
        scr = Object.keys(report2.frameworks).reduce(function(acc, framework) {
            return acc + parseFloat(report2.frameworks[framework].percentile * 100)
        }, 0)
        scr /= Object.keys(report2.frameworks).length
        document.getElementById("score2").innerHTML = scr
    }
}

function displayBenchmark(b) {
    // hide percentile chart
    var rep = b == 0 ? report : report2
    percentileChart.data.datasets[0].data[b] = isNaN(percentileChart.data.datasets[0].data[b]) ? rep.frameworks[selectedFramework].percentile * 100 : NaN
    
    // hide timing chart
    myChart.data.datasets[b].hidden = !myChart.data.datasets[b].hidden;

    // hide std dev chart
    sdChart.data.datasets[b].hidden = !sdChart.data.datasets[b].hidden

    document.getElementsByClassName("togglebtn")[b].style.backgroundColor = myChart.data.datasets[b].hidden ? '#364554' :'#9CABBA'
    percentileChart.update()
    sdChart.update()
    myChart.update()
}

function addButtons(report) {
    var keys = Object.keys(report.frameworks)

    for(var i = 0; i < keys.length; i++) {
        var $but = $('<button onclick="fwClick(value)" value="' + keys[i] + '" class="btn" type="button">'+ keys[i] + ' </button>')
        // add background color change on hover
        $but.hover(function() {

        })
        $but.appendTo(".btn-group")
    }
}
