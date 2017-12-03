var TestLibrary = include('TestProfiles.json');

class TestAgent {
    constructor(socket, completion) {
        this.frameworkIndex = -1;
        this.testIndex = -1;
        this.socket = socket;
        this.completion = completion;
        this.setup();
        this.testsComplete = 0;
        this.results = [];
    }

    setup() {

        this.socket.on('benchmark_request', function(params) {
            console.log(params);

            this.frameworks = [];
            TestLibrary.forEach(function(test) {
                var id = test.id;
                if (params[id] === 'on') {
                    this.frameworks = this.frameworks.concat(test);
                }
            }.bind(this));
            
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
            var params = {
                'testapp_script' : '/testapp_bin/' + framework.testapp_script,
                'testapp_html' : '/testapp_bin/' + framework.testapp_html,
                'test_script' : '/test_bin/' + framework.test_script,
            };
            console.log(params);
            console.log('sending framework_load');
            this.testIndex = -1;
            this.socket.emit('framework_load', params);
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
            'id' : 'AAA-BBB-CCC',
            'tempresults' : this.results
        };
        this.socket.emit('benchmark_done', fake);
    }
    
    logResult(result) {
        this.results = this.results.concat(result);
        console.log('result: ' + JSON.stringify(result));
    }
}

module.exports = TestAgent;