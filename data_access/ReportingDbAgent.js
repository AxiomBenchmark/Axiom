const { Pool } = require('pg');

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

// connection pool to handle lots of requests.
const pool = new Pool();

const averageTestResultSQL = 
  "SELECT bftr.description, {0}(bftr.floatresult)\
  FROM benchmarkframeworks bf, benchmarkframeworktests bft, benchmarkframeworktestresults bftr\
  WHERE bf.frameworkid = bft.frameworkid AND \
        bft.testid = bftr.testid AND \
        bf.frameworkname = $1 \
        AND bft.description = $2\
  GROUP BY bftr.description;"


class ReportingDbAgent {

  //get an aggregation of a certain tests results across all platforms.
  getTestMIN_AVG_MAX_COUNT(framework, test, func, callback) {
    var queryString = averageTestResultSQL.format(func.toUpperCase());
    const values = [framework, test];
    pool.query(queryString, values, (err, res) => {
      var report = {};
      res.rows.forEach(element => {
        report[element.description] = element[func.toLowerCase()];
      });
      callback(report);
    });
  }
}

module.exports = new ReportingDbAgent();
if (!process.env.SQL_DEBUG) return;
module.exports.getTestMIN_AVG_MAX_COUNT('React', 'Lifecycle Test A', 'count', (rep) => {console.log('min\n' + JSON.stringify(rep))});
module.exports.getTestMIN_AVG_MAX_COUNT('React', 'Lifecycle Test A', 'avg', (rep) => {console.log('avg\n' + JSON.stringify(rep))});
module.exports.getTestMIN_AVG_MAX_COUNT('React', 'Lifecycle Test A', 'max', (rep) => {console.log('max\n' + JSON.stringify(rep))});