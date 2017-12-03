suite = class FakeFrameworkTestSuite {
    
    constructor() {
    }

    runTest(params, callback) {
        console.log('running function ' + params.function + ' on UUT.');
        this[params.function](callback);
    }

    sliderTest(callback) {
        var start = performance.now();
        setTimeout(function() {
            var end = performance.now();
            var results = {
                'test': 'sliderTest',
                'delta': end - start
            };
            callback(results);
        }, 1000);
    }

    testB(callback) {
        for (var i = 300; i < 600; i++) {
            $('#testbench').append('<span id=\'' + i + '\'><span>');
        }
        var start = performance.now();
        for (var i = 0; i < 100000; i++) {
            var id = Math.floor(Math.random() * 1200);
            $('#' + id).html(' ' + i);
        }
        var end = performance.now()
        var delta = end - start;
        var results = {
            'test' : 'testB',
            'time' : delta
        }
        callback(results);
    }
    
    testC(callback) {
        for (var i = 600; i < 900; i++) {
            $('#testbench').append('<span id=\'' + i + '\'><span>');
        }
        var start = performance.now();
        for (var i = 0; i < 100000; i++) {
            var id = Math.floor(Math.random() * 1800);
            $('#' + id).html(' ' + i);
        }
        var end = performance.now()
        var delta = end - start;
        var results = {
            'test' : 'testC',
            'time' : delta
        }
        callback(results);
    }
}

//UUT = new suite();