var ctx = document.getElementById("myChart").getContext('2d');
Chart.defaults.global.defaultFontColor = "#686a8b";

var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Mount", "Render", "Update", "Destroy", "Create", "Swap"],
        datasets: [{
            label: 'Benchmark 1',
            data: [.5, .5, .5, .5, .5, .5],
            hidden: false,
            backgroundColor: [
                'rgba(255, 74, 75, .5)',
                'rgba(255, 74, 75, .5)',
                'rgba(255, 74, 75, .5)',
                'rgba(255, 74, 75, .5)',
                'rgba(255, 74, 75, .5)',
                'rgba(255, 74, 75, .5)',
                'rgba(255, 74, 75, .5)',
                // 'rgba(54, 162, 235, 0.2)',
                // 'rgba(255, 206, 86, 0.2)',
                // 'rgba(75, 192, 192, 0.2)',
                // 'rgba(153, 102, 255, 0.2)',
                // 'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 74, 75, .5)',
                'rgba(255, 74, 75, .5)',
                'rgba(255, 74, 75, .5)',
                'rgba(255, 74, 75, .5)',
                'rgba(255, 74, 75, .5)',
                'rgba(255, 74, 75, .5)',
                'rgba(255, 74, 75, .5)',
            ],
            borderWidth: 2
        },
        {
            label: 'Benchmark 2',
            data: [.25, .25, .25, .25, .25, .25],
            hidden: false,
            backgroundColor: [
                'rgba(27, 175, 255, .5)',
                'rgba(27, 175, 255, .5)',
                'rgba(27, 175, 255, .5)',
                'rgba(27, 175, 255, .5)',
                'rgba(27, 175, 255, .5)',
                'rgba(27, 175, 255, .5)',
                'rgba(27, 175, 255, .5)',
                // 'rgba(255, 99, 132, 0.2)',
                // 'rgba(54, 162, 235, 0.2)',
                // 'rgba(255, 206, 86, 0.2)',
                // 'rgba(75, 192, 192, 0.2)',
                // 'rgba(153, 102, 255, 0.2)',
                // 'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(27, 175, 255, 1)',
                'rgba(27, 175, 255, 1)',
                'rgba(27, 175, 255, 1)',
                'rgba(27, 175, 255, 1)',
                'rgba(27, 175, 255, 1)',
                'rgba(27, 175, 255, 1)',
            ],
            borderWidth: 2
        }
    ]},
    options: {
        title: {
            display: true,
            text: 'TEST',
            size: '20px'
        },
        tooltips: {
            mode: 'index',
            intersect: true
        },
        scales: {
            yAxes: [{
                ticks: {
                    suggestedMax: 1,
                    beginAtZero:true
                }
            }]
        },
        responsive: true,
        maintainAspectRatio: false,
    }
});

var pctx = document.getElementById("percentileChart").getContext('2d');

pdata = {
    datasets: [{
        data: [percentile, 100-percentile],
        backgroundColor: [
            'rgba(255, 74, 75, 1)'
        ],
        // borderWidth: 1,
        // borderColor: 'rgba(220, 60, 100, 1)',
    }],
};
var myDoughnutChart = new Chart(pctx, {
    type: 'doughnut',
    data: pdata,
    options: {
        // title: {
        //     display: true,
        //     // text: 'Percentile'
        // },
        responsive:true,
        maintainAspectRatio: false,
    }
});

var sdctx = document.getElementById("sdChart").getContext('2d')
var sdData = {
    datasets: [{
        data: [{x:sd, y:1}],
        backgroundColor: [
            'rgba(255, 74, 75, 1)'
        ],
        // borderWidth: 1,
        // borderColor: 'rgba(220, 60, 100, 1)',
    }]
}
var sdChart = new Chart(sdctx, {
    type: 'scatter',
    data: sdData,
    options: {
        // title: {
        //     display: true,
        //     text: 'Standard Deviation'
        // },
        scales: {
            xAxes: [{
                ticks: {
                    max: 3,
                    min: -3,
                    beginAtZero:true
                }
            }]
        },
        maintainAspectRatio: false,
        responsive:true
    }
})