var log = function(text) {
    $('#log').prepend(text + '<br>');
}

var socket = io();

socket.on('connect', () => {
    log('connected to server socket. Listening...');
});

socket.on('request', (params) => {
    log(params.name + ' requested.');

    var callback = function(result) {
        log(params.name + ' done. Result: ' + JSON.stringify(result));
        socket.emit('result', result);
    }

    UUT.runTest(params, callback);
});