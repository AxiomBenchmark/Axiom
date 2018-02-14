const http = require('http');
const TestLibrary = require('../TestProfiles.json');
const ResultDbAgent = require('../data_access/ResultDbAgent');

const DECIMAL_PLACES = 7

/*
Rounds floating point results to the defined number of decimal places.
*/
const roundFloat = function(num) {
    return Math.trunc(num * Math.pow(10, DECIMAL_PLACES)) / Math.pow(10, DECIMAL_PLACES);
}

/*
Handles the benchmark execution for a single client.
Specifically in charge of loading and executing tests and collecting test results.
See the BenchmarkAgent documentation in GitHub for more details about its functionality.
*/
class BenchmarkAgent {

    /*
    Constructor. Requires the socket to communicate with the target client,
    and the complete(results) callback when complete.
    */
    constructor(socket, completion) {
        // track what framework / test is currently being run
        this.frameworkIndex = -1;
        this.testIndex = -1;

        // track how many tests are complete for progress updates
        this.testsComplete = 0;

        // store socket, completion handler
        this.socket = socket;
        this.completion = completion;
        this.results = [];

        // setup socket listeners
        this.socket.on('benchmark_request', this.onBenchmarkRequest.bind(this));
        this.socket.on('framework_ready', this.onFrameworkReady.bind(this));
        this.socket.on('test_result', this.onTestResult.bind(this));
    }

    /*
    Creates a new benchmark object in the database.
    Requires the userAgent provided by the client's browser, and the completion callback.
    */
    createBenchmark(userAgent, callback) {
        // interpret the user agent string sent by client for benchmark metadata.
        const url = "http://useragentapi.com/api/v4/json/" + process.env.USERAGENT_APIKEY + "/" + 
            encodeURIComponent(userAgent);
        http.get(url, function (res) {
            let rawData = '';
            res.on('data', function (chunk) { rawData += chunk; });
            res.on('end', function() {
              try {
                // once user agent api is done, save benchmark
                const data = JSON.parse(rawData).data;
                ResultDbAgent.newBenchmark(data.os_name, data.os_version, data.browser_name,
                    data.browser_version, data.ua_type, data.engine_name, data.engine_version, 
                    function (id) {
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

    /*
    Triggered when the client requests the benchmark to begin.
    Requires the frameworks for the benchmark to run.
    */
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
            ResultDbAgent.generateUniqueId(function(id) {
                this.createBenchmark(params.userAgent, function() {
                    // start testing
                    this.loadNextFramework();
                });
            });
        } else {
            console.log('empty benchmark request!');
        }
    }

    /*
    Triggered when the client reports that the framework is loaded and ready
    for testing.
    */
    onFrameworkReady() {
        this.nextTest();
    }

    /*
    Triggered when the client sends the results of a test
    */
    onTestResult(result) {
        this.results = this.results.concat(result);
        ResultDbAgent.newTest(this.frameworkid, result.test, function(testid) {
            delete result.test;
            for (var i in result) {
                ResultDbAgent.newResult(testid, i, roundFloat(result[i], 7));
            }
            this.testsComplete++;
            this.sendProgress();
            this.nextTest();
        });
    }

    /*
    Loads the next framework on the client.
    */
    loadNextFramework() {
        this.frameworkIndex++;
        var framework = this.frameworks[this.frameworkIndex];
        if (framework) {
            ResultDbAgent.newFramework(this.id, framework.framework, framework.version, function (id) {
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

    /*
    Requests the client to run the next test.
    */
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

    /*
    Sends the client the progress of the benchmark.
    */
    sendProgress() {
        // compute number of tests if not done so already
        if (!this.testCount) {
            this.testCount = 0;
            this.frameworks.forEach(function (framework) {
                framework.tests.forEach(function (test) {
                    this.testCount++;
                });
            });
        }

        var percentage = (this.testsComplete / this.testCount) * 100;
        this.socket.emit('benchmark_progress', {'percent' : percentage});
    }

    /*
    Inform the client that the benchmark is complete
    */
    done() {
        var data = {
            'id' : this.id,
            'tempresults' : this.results
        };
        this.socket.emit('benchmark_done', data);
        ResultDbAgent.completeBenchmark(this.id);
    }
}

module.exports = BenchmarkAgent;