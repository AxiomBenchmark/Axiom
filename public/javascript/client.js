var log = function(text) {
    //$('#statusbar').prepend(text + '<br>');
    console.log(text);
}

var socket = io();
var UUT;
var suite;

socket.on('connect', () => {
    log('connected to server socket. Listening...');
    socket.emit('benchmark_ready');
});

//loads a new framework script.
//the framework script should generate a UUT which can be unloaded later.
socket.on('framework_load', (params) => {
    UUT = null;
    $.getScript(params.script, function(data, status, code){
        if (status === 'success') {
            log('framework test ' + params.script + ' loaded.');
        }
        else {
            var message = 'status: ' + status + '\ncode: ' + code;
            log(message);
        }
        
        //any initialization after framework load and before first test
        socket.emit('framework_ready');
    });
});

//executes the requested test on the loaded framework
socket.on('test_request', (params) => {
    log('test_request: ' + params.name + ' requested.');

    var callback = function(result) {
        log(params.name + ' done. Result: ' + JSON.stringify(result));
        socket.emit('test_result', result);
    }

    UUT.runTest(params, callback);
});

socket.on('benchmark_done', function(params) {
    log('benchmark complete. Result id: ' + params.id);
});

socket.on('benchmark_progress', (params) => {
    console.log(params.percent);
    $('#progressBar').val(params.percent);
});