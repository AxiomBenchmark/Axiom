var reports = JSON.parse(rep);
var report = reports.benchmark
var report2 = reports.benchmark2
var stats = reports.statistics

var compareTwo = reports.benchmark2 != undefined

// LUTs
var os = {"macOS": "apple", "Windows": "windows", "Linux": "linux", "Android": "android"}
var hw = {"Desktop": "desktop", "Mobile": "mobile"}
var browser = {"Chrome": "chrome", "Opera": "opera", "Safari": "safari", "Firefox": "firefox"}

console.log(compareTwo)
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
    }

    myChart.update()
})

function getFrameworkData(json, framework) {
    let data = []
    let keys = Object.keys(json.results)

    keys.forEach(function(e, i) {
        let results = Object.keys(json.results[e])
        
        results.forEach(function(n, j) {
            let obj = {
                "name": n,
                "value": json.results[e][n]
            }
            data.push(obj)
        })
    })

    return data
}

function fwClick(e) {
    setChartData(e)    
    
    // change button background colors
    let btns = document.getElementsByClassName("btn")

    for(let i = 0; i < btns.length; i++) {
        if(btns[i].value === e) {
            btns[i].style.backgroundColor = '#253042'
            btns[i].style.color = '#ff5b54'
            btns[i].onmouseover
            // btns[i].style. 
        } else {
            btns[i].style.backgroundColor = 'inherit'
            btns[i].style.color = 'white'
        }
    }
}

function setChartData(e) {
    if(report.frameworks[String(e)]) {
        let data = getFrameworkData(report.frameworks[String(e)], String(e))
        myChart.data.labels = data.map(function(d) {return d.name})
        myChart.data.datasets[0].data = data.map(function(d) {return d.value})

        if(report2 != undefined) {
            let data2 = getFrameworkData(report2.frameworks[String(e)], String(e))
            myChart.data.labels = data2.map(function(d) {return d.name})
            myChart.data.datasets[1].data = data2.map(function(d) {return d.value})
            myChart.data.datasets[1].hidden = false
        }
        myChart.options.title.text = e
        myChart.update()
    }
    else {
        console.log("data not available")
    }
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
