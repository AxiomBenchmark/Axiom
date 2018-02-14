const ResultDbAgent = require('../data_access/ReportingDbAgent');

const ReportingAgent = function(query, callback) {
    var result = {};

    if (query.length === 0) {
        result.error = 'no query specified.';
        callback(result);
        return;
    }

    if (query.length > 1) {
        result.error = 'only one query item allowed at this time.';
        callback(result);
        return;
    }

    if (query.benchmark) {
        ResultDbAgent.getBenchmarkResults(query.benchmark, function(err, res) {
            if (err) {
                callback(err, null);
                return;
            }
            else {
                // res.type = "benchmark";
                callback(null, {'report' : JSON.stringify(res)});
            }
        })
        return;
    }

    result.error = 'invalid/unknown query.';
    callback(result);
    return;
}

module.exports = ReportingAgent;