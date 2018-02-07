let path = require('path');
let BenchmarkAgent = require('./BenchmarkAgent');

var io;
/*
Handles the connection of new test clients.
Dispatches a BenchmarkAgent for each client.
*/
class BenchmarkAgentManager {
    constructor(http) {
        io = require('socket.io')(http);

        console.log('BenchmarkAgentManager initializing.');
    
        // when a new client connects, dispatch a new benchmark agent.
        io.on('connection', function(socket) {
            var completion = function() {
                console.log('done');
            }
            var newAgent = new BenchmarkAgent(socket, completion);
        }.bind(this));
    }
}

module.exports = BenchmarkAgentManager;