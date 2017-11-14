var testAgent = require(require('path').join(__dirname, '/testAgent'));

module.exports = function(http) {
    console.log('socketManager initializing.');
    var io = require('socket.io')(http);

    console.log('benchserver initializing.');
    
    //temporary fake test
    var test = require(require('path').join(__dirname, 'fakeTestProfile'));

    io.on('connection', function(socket) {
        console.log('client connected');

        var newAgent = new testAgent(test, socket);
        newAgent.begin();
    })
    
};