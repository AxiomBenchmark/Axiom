const ResultDbAgent = require('../data_access/ReportingDbAgent');
const IdValidator = require('../data_access/BenchmarkIdGenerator').validate;

const ReportingAgent = function(query, callback) {
    var length = Object.keys(query).length

    // query needs to be present
    if (length === 0) {
        callback('no query specified.', null);
        return;
    }

    // validate query length
    if (length > 2) {
        callback('invalid number of benchmarks specified.', null);
        return;
    }

    // if user only specified second benchmark, make it the first one to simplify logic.
    if (!query.benchmark && query.benchmark2) {
        query.benchmark = query.benchmark2
        query.benchmark2 = undefined
    }

    var report = {};

    if (!query.benchmark)
    {
        callback('No benchmark specified.')
        return;
    }

    if (!IdValidator(query.benchmark)) {
        callback(query.benchmark + " is not a valid ID.");
        return;
    }
    
    // Get STATISTICS
    ResultDbAgent.getAverageBenchmark(function(err, res) {
        if (err) {
            callback(err, null);
            return;
        }

        report.statistics = res;

        //Get FIRST report
        ResultDbAgent.getBenchmarkResults(query.benchmark, function(err, res) {
            if (err) {
                callback(err, null);
                return;
            }

            report.benchmark = res;

            if (!query.benchmark2) {
                callback(err, report);
                return;
            }

            ResultDbAgent.getBenchmarkResults(query.benchmark2, function(err, res) {
                if (err) {
                    callback(err, null);
                    return;
                }
                report.benchmark2 = res;
                callback(null, report);
            });
        });
    });
}

module.exports = ReportingAgent;