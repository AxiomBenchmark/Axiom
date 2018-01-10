let TestAgent = include('benchmark_server/TestAgent');
var io;

class TestAgentManager {
    constructor(http) {
        io = require('socket.io')(http);

        console.log('TestAgentManager initializing.');
    
        io.on('connection', function(socket) {
            var completion = function() {
                console.log('done');
            }
            var newAgent = new TestAgent(socket, completion);
        }.bind(this));
    }
}

module.exports = TestAgentManager;