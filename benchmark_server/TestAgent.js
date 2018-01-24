const http = require('http');
const TestLibrary = require('../TestProfiles.json');
const ResultDbAgent = require('../data_access/ResultDbAgent');

const truncate = function(num, places) {
    return Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
  }

class TestAgent {
    constructor(socket, completion) {
        this.frameworkIndex = -1;
        this.testIndex = -1;
        this.testsComplete = 0;
        this.socket = socket;
        this.completion = completion;
        this.results = [];

        //setup socket listeners
        this.socket.on('benchmark_request', this.onBenchmarkRequest.bind(this));
        this.socket.on('framework_ready', this.onFrameworkReady.bind(this));
        this.socket.on('test_result', this.onTestResult.bind(this));
    }

    //store the benchmark session in the database
    createBenchmark(userAgent, callback) {
        // interpret the user agent string sent by client for benchmark metadata.
        const url = "http://useragentapi.com/api/v4/json/" + process.env.USERAGENT_APIKEY + "/" + encodeURIComponent(userAgent);
        http.get(url, (res) => {
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
              try {
                // once user agent api is done, save benchmark
                const data = JSON.parse(rawData).data;
                ResultDbAgent.newBenchmark(data.os_name, data.os_version, data.browser_name,
                    data.browser_version, data.ua_type, data.engine_name, data.engine_version, (id) => {
                        // set id and continue
                        this.id = id;
                        callback();
                    });
              } catch (e) {
                console.error(e.message);
              }
            });
        })
    }

    // when the client requests a benchmark test
    onBenchmarkRequest(params) {
        // add each framework that is turned on to the to-do list
        this.frameworks = [];
        TestLibrary.forEach(function(test) {
            var id = test.id;
            if (params[id] === 'on') {
                this.frameworks = this.frameworks.concat(test);
            }
        }.bind(this));

        if (this.frameworks.length) {
            ResultDbAgent.generateUniqueId((id) => {
                this.createBenchmark(params.userAgent, () => {
                    // start testing
                    this.loadNextFramework();
                });
            });
        } else {
            console.log('empty benchmark request!');
        }
    }

    // when the client reports that the current framework is ready
    onFrameworkReady() {
        this.nextTest();
    }

    // when the client sends the results of a test
    onTestResult(result) {
        this.results = this.results.concat(result);
        ResultDbAgent.newTest(this.frameworkid, result.test, (testid) => {
            delete result.test;
            for (var i in result) {
                ResultDbAgent.newResult(testid, i, truncate(result[i], 7));
            }
            this.testsComplete++;
            this.sendProgress();
            this.nextTest();
        });
    }

    // request setup for the next framework
    loadNextFramework() {
        this.frameworkIndex++;
        var framework = this.frameworks[this.frameworkIndex];
        if (framework) {
            ResultDbAgent.newFramework(this.id, framework.framework, framework.version, (id) => {
                this.frameworkid = id;
            
                var params = {};

                if (framework.testapp_script) {
                    params.testapp_script = '/testapp_bin/' + framework.testapp_script;
                }

                if (framework.testapp_html) {
                    params.testapp_html = '/testapp_bin/' + framework.testapp_html;
                }

                this.testIndex = -1;
                this.socket.emit('framework_load', params);
            });
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
            // no more tests for this framework - next!
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
        var data = {
            'id' : this.id,
            'tempresults' : this.results
        };
        this.socket.emit('benchmark_done', data);
        ResultDbAgent.completeBenchmark(this.id);
    }
}

module.exports = TestAgent;