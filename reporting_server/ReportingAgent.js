const ResultDbAgent = require('../data_access/ReportingDbAgent');
const IdValidator = require('../data_access/BenchmarkIdGenerator').validate;

const ReportingAgent = function(query, callback) {
    // query needs to be present
    if (query.length === 0) {
        callback('no query specified.', null);
        return;
    }

    // validate query length
    if (query.length > 2 || query.length === 0) {
        callback('invalid number of benchmarks specified.', null);
        return;
    }

    // if user only specified second benchmark, make it the first one to simplify logic.
    if (!query.benchmark && query.benchmark2)
    {
        query.benchmark = query.benchmark2
        query.benchmark2 = undefined
    }

    var report = {};

    if (query.benchmark) {
        // fail on invalid ID.
        if (!IdValidator(query.benchmark)) {
            callback(query.benchmark + " is not a valid ID.");
            return;
        }
        
        // get the results for the FIRST benchmark.
        ResultDbAgent.getBenchmarkResults(query.benchmark, function(err, res) {
            if (err) {
                callback(err, null);
                return;
            }
            else {
                // save results to report obj
                report.benchmark = res

                // get the results for the SECOND benchmark.
                if (query.benchmark2) {
                    // fail on invalid ID.
                    if (!IdValidator(query.benchmark2)) {
                        callback(query.benchmark + " is not a valid ID.");
                        return;
                    }
                    ResultDbAgent.getBenchmarkResults(query.benchmark, function(err, res) {
                        if (err) {
                            callback(err, null);
                            return;
                        }
                        else {
                            report.benchmark2 = res
                            callback(null, {'report' : JSON.stringify(report)});
                            return;
                        }
                    })
                }
                else { // if only one benchmark ID
                    callback(null, {'report' : JSON.stringify(report)});
                    return;
                }
            }
        })
    } else {
        callback('invalid/unknown query.', null);
    }
}

module.exports = ReportingAgent;