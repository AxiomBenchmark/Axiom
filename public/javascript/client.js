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

    //reset bench
    UUT = null;
    $('#testbench').empty();

    //setup function to load the test app, then the test itself.
    //may be called immediately or after html is loaded, see below.
    var loadAppAndTestScript = function() {
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
    }

    //If framework requires HTML templating, load that in before app / test.
    //Otherwise, go ahead and load app / test.
    if (params.testapp_html) {
        console.log('fetching html...');
        $('#testbench').load(params.testapp_html, function() {
            loadAppAndTestScript();
        });
    }
    else {
        loadAppAndTestScript();
    }
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
    $('#testbench').html("<p>"+JSON.stringify(params.tempresults) + "</p>");
});

socket.on('benchmark_progress', (params) => {
    $('#progressBar').val(params.percent);
});