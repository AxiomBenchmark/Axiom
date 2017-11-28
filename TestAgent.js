class TestAgent {
    constructor(test, socket, completion) {
        this.frameworks = test;
        this.frameworkIndex = -1;
        this.testIndex = -1;
        this.socket = socket;
        this.completion = completion;
        console.log(JSON.stringify(socket.handshake.headers));
        this.id = socket.id;
        this.setup();
        this.testsComplete = 0;
    }

    setup() {

        this.socket.on('benchmark_ready', function() {
            this.loadNextFramework();
        }.bind(this));

        this.socket.on('framework_ready', function() {
            this.nextTest();
        }.bind(this));

        this.socket.on('test_result', function(result) {
            this.testsComplete++;
            this.sendProgress();
            this.logResult(result);
            this.nextTest();
        }.bind(this));
    }

    //request setup for the next framework
    loadNextFramework() {
        console.log('loadNextFramework()');
        this.frameworkIndex++;
        var framework = this.frameworks[this.frameworkIndex];
        if (framework) {
            console.log('sending framework_load');
            this.testIndex = -1;
            this.socket.emit('framework_load', framework);
        }
        else {
            console.log('no more frameworks - benchmark_complete');
            this.done();
        }
    }

    nextTest() {
        this.testIndex++;
        var test = this.frameworks[this.frameworkIndex].tests[this.testIndex];
        if (test) {
            this.socket.emit('test_request', test);
        }
        else {
            console.log('tests for this framework complete.');
            this.loadNextFramework();
        }
    }

    sendProgress() {
        //compute number of tests if not done so already
        if (!this.testCount) {
            this.testCount = 0;
            this.frameworks.forEach(framework => {
                framework.tests.forEach(test => {
                    this.testCount++;
                });
            });
        }

        var percentage = (this.testsComplete / this.testCount) * 100;
        this.socket.emit('benchmark_progress', {'percent' : percentage});
    }

    //tell client that benchmark is done.
    //TODO: send result id to client
    done() {
        var fake = {
            'id' : 'AAA-BBB-CCC'
        };
        this.socket.emit('benchmark_done', fake);
    }
    
    logResult(result) {
        console.log('result: ' + JSON.stringify(result));
    }
}

module.exports = TestAgent;