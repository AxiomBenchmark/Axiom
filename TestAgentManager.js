var TestAgent = include('TestAgent');
var io;

class TestAgentManager {
    constructor(http) {
        io = require('socket.io')(http);

        console.log('TestAgentManager initializing.');
        
        //temporary fake test
        var test = include('fakeTestProfiles');
    
        io.on('connection', function(socket) {
            var completion = function() {
                console.log('done');
            }
            var newAgent = new TestAgent(test, socket, completion);
        }.bind(this));
    }
}

module.exports = TestAgentManager;