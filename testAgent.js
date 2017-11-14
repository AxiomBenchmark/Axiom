class TestAgent {
    constructor(test, socket) {
        this.test = test;
        this.testIndex = 0;
        this.socket = socket;
    }

    begin() {

        //callback when a result comes back
        var onResult = function(result) {
            this.logResult(result);
            this.nextTest();
        }.bind(this);

        //when socket result, call above function
        this.socket.on('result', function(params) {
            onResult(params);
        });

        //start the tests.
        console.log('starting test agent...');
        this.nextTest();
    }

    nextTest() {
        var next = this.test.tests[this.testIndex];
        if (next === undefined) {
            console.log('tests complete.');
            return;
        }

        console.log('sending next test (' + next.name + ')...');
        this.testIndex++;
        this.socket.emit('request', next);
    }
    
    logResult(result) {
        console.log('result: ' + JSON.stringify(result));
    }
}

module.exports = TestAgent;