const TestLibrary = include('TestProfiles.json');

class TestAgent {
    constructor(socket, completion) {
        this.frameworkIndex = -1;
        this.testIndex = -1;
        this.testsComplete = 0;
        this.socket = socket;
        this.completion = completion;
        this.results = [];
        this.setupListeners();
    }

    // setup socket listeners
    setupListeners() {
        this.socket.on('benchmark_request', function(params) {
            // add each framework requested to the to-do list
            this.frameworks = [];
            TestLibrary.forEach(function(test) {
                var id = test.id;
                if (params[id] === 'on') {
                    this.frameworks = this.frameworks.concat(test);
                }
            }.bind(this));

            // start testing
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

    // request setup for the next framework
    loadNextFramework() {
        this.frameworkIndex++;
        var framework = this.frameworks[this.frameworkIndex];
        if (framework) {
            var params = {};

            if (framework.testapp_script) {
                params.testapp_script = '/testapp_bin/' + framework.testapp_script;
            }

            if (framework.testapp_html) {
                params.testapp_html = '/testapp_bin/' + framework.testapp_html;
            }

            this.testIndex = -1;
            this.socket.emit('framework_load', params);
        }
        else {
            this.done();
        }
    }

    // request next test
    nextTest() {
        this.testIndex++;
        var test = this.frameworks[this.frameworkIndex].tests[this.testIndex];
        if (test) {
            this.socket.emit('test_request', test);
        }
        else {
            this.loadNextFramework();
        }
    }

    // send client a percent complete update
    sendProgress() {
        // compute number of tests if not done so already
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

    // tell client that benchmark is done.
    // TODO: send result id to client
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