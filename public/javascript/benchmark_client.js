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

var resetUUT = function() {
    window.UUT = {
        runTest : function (params, callback) {
          console.log('running function ' + params.function + ' on UUT.');
          console.log(this);
          this[params.function](callback);
        }
    };
}


var socket = io();
var suite;

socket.on('connect', function() {
    log('connected to server socket. Listening...');
    urlParams.userAgent = navigator.userAgent;
    socket.emit('benchmark_request', urlParams);
});

//loads a new framework script.
//the framework script should generate a UUT which can be unloaded later.
socket.on('framework_load', function(params) {

    //reset bench
    resetUUT();
    $('#testbench').empty();

    //set script to load JS after HTML
    var scriptLoader = function() {
        //load JS, if available (should always be)
        if (params.testapp_script) {
            console.log('loading JS...');
            $.getScript(params.testapp_script, function(data, status, code) {
                if (status === 'success') {
                    console.log(params.testapp_script + ' loaded. (JS)');
                    socket.emit('framework_ready');
                }
                else {
                    console.log('JS Loading ERROR ' + code);
                }
            });
        }
        else {
            console.log('no JS to load.');
        }
    }

    //load HTML first, if available (sometimes)
    if (params.testapp_html) {
        console.log('loading HTML...');
        $('#testbench').load(params.testapp_html, function(data, status, code) {
            if (status === 'success') {
                console.log(params.testapp_html + ' loaded. (HTML)');
                scriptLoader();
            }
            else {
                console.log('Html Loading ERROR ' + code);
            }
            
        });
    }
    //otherwise , just load the JS
    else {
        console.log('no HTML to load.');
        scriptLoader();
    }
});

//executes the requested test on the loaded framework
socket.on('test_request', function(params) {
    console.log(params);
    log('test_request: ' + params.name + ' requested.');

    var callback = function(result) {
        log(params.name + ' done. Result: ' + JSON.stringify(result));
        // result.function = params.function;
        //result.name = params.name;
        socket.emit('test_result', result);
    }

    window.UUT.runTest(params, callback);
});

socket.on('benchmark_done', function(params) {
    log('benchmark complete. Result id: ' + params.id);
    window.location.href = window.location.origin + '/report?benchmark=' + params.id;
});

socket.on('benchmark_progress', function(params) {
    var i = setInterval(function(p) {
        let progress = $('#progressBar').val();
        if(progress < p) {
            $('#progressBar').val(progress + 2)
        }

        if (progress == 100) {
          clearInterval(i);
        }
      }, 10, params.percent);
});