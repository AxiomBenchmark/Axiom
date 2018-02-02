var report = JSON.parse(rep.replace(/&#34;/g, '"'))
// console.log(report)

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
    if(report.frameworks[String(e)]) {
        // console.log(report.frameworks[String(e)])
        let data = getFrameworkData(report.frameworks[String(e)], String(e))
        // console.log(myChart.data.datasets[0].data)
        myChart.data.labels = data.map(function(d) {return d.name})
        myChart.data.datasets[0].data = data.map(function(d) {return d.value})
        // console.log(myChart.data.datasets[0].data)
        myChart.update()
    }
    else {
        console.log("data not available")
    }
}