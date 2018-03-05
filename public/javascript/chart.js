var ctx = document.getElementById("myChart").getContext('2d');
Chart.defaults.global.defaultFontColor = "#686a8b";
Chart.defaults.global.defaultFontSize = 18; 
Chart.defaults.global.defaultFontFamily = "Roboto";

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
            fontSize: 23,
            fontStyle: 'normal',
            // fontFamily: "'Roboto', 'sans-serif'"
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
                },
                scaleLabel: {
                    display: true,
                    labelString: "Time (ms)",
                    fontSize: 18
                }
                
            }]
        },
        responsive: true,
        maintainAspectRatio: false,
    }
});

var pctx = document.getElementById("percentileChart").getContext('2d');

var pdata = {
    datasets: [{
        data: [0, 0],
        backgroundColor: [
            'rgba(255, 74, 75, .5)',
            'rgba(27, 175, 255, .5)'
        ],
        borderWidth: 1,
        borderColor: [
            'rgba(220, 60, 100, 1)',
            'rgba(27, 175, 255, 1)'
        ],
    }],
    labels: ["bleh", "moo"],
};

var percentileChart = new Chart(pctx, {
    type: 'polarArea',
    data: pdata,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scale: {
            ticks: {
                beginAtZero:true,
                max: 100
            }
        }
    }
});

var sdctx = document.getElementById("sdChart").getContext('2d')
var sdData = {
    labels: ["Mount", "Render", "Update", "Destroy", "Create", "Swap"],
    datasets: [{
        label: "Benchmark 1",
        backgroundColor: 'rgba(255, 74, 75, .5)',
        pointBackgroundColor: 'rgba(255, 74, 75, 1)',
        borderColor: 'rgba(220, 60, 100, 1)',
        borderWidth:1,
        // hoverPointBackgroundColor: "#fff",
        // pointHighlightStroke: "rgba(151,187,205,1)",
        data: [1,2,3,4,5],
        hidden: false
    },
    {
        label: "Benchmark 2",
        backgroundColor: 'rgba(27, 175, 255, .5)',
        pointBackgroundColor: 'rgba(27, 175, 255, 1)',
        borderColor: 'rgba(27, 175, 255, 1)',
        borderWidth:1,
        // hoverPointBackgroundColor: "#fff",
        // pointHighlightStroke: "rgba(151,187,205,1)",
        data: [1,2,3,4,5],
        hidden: false
    }]
}
var sdChart = new Chart(sdctx, {
    type: 'radar',
    data: sdData,
    options: {
        // title: {
        //     display: true,
        //     text: 'Standard Deviation'
        // },
        // scales: {
        //     xAxes: [{
        //         ticks: {
        //             max: 3,
        //             min: -3,
        //             beginAtZero:true
        //         }
        //     }]
        // },
        maintainAspectRatio: false,
        responsive:true
    }
})