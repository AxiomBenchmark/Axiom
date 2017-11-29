var log = function(text) {
    //$('#statusbar').prepend(text + '<br>');
    console.log(text);
}

var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();


var socket = io();
var UUT;
var suite;

socket.on('connect', () => {
    log('connected to server socket. Listening...');
    socket.emit('benchmark_request', urlParams);
});

//loads a new framework script.
//the framework script should generate a UUT which can be unloaded later.
socket.on('framework_load', (params) => {

    UUT = null;
    $.getScript(params.testapp_script, function(data, status, code){
        if (status === 'success') {
            log('testapp ' + params.testapp_script + ' loaded.');
            $.getScript(params.test_script, function(data, status, code){
                console.log(window.UUT);
                if (status === 'success') {
                    log('test ' + params.test_script + ' loaded. Ready!');
                    socket.emit('framework_ready');
                }
                else {
                    var message = 'status: ' + status + '\ncode: ' + code;
                    log(message);
                }
            });
        }
        else {
            var message = 'status: ' + status + '\ncode: ' + code;
            log(message);
        }
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