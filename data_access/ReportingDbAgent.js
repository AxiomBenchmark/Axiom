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

const benchmarkResultSQL = 
  "SELECT timestamp, iscomplete, operatingsystem, operatingsystemversion, \
   browser, browserversion, hardwaretype, frameworkname, frameworkversion, \
   bftr.description, floatresult, bft.description as testdesc \
   FROM benchmarks b, benchmarkframeworks bf, \
   benchmarkframeworktests bft, benchmarkframeworktestresults bftr \
   WHERE b.benchmarkid = bf.benchmarkid AND \
   bf.frameworkid = bft.frameworkid AND \
   bft.testid = bftr.testid AND \
   b.benchmarkid = $1;"

class ReportingDbAgent {

  //get an aggregation of a certain tests results across all platforms.
  getTestMIN_AVG_MAX_COUNT(framework, test, func, callback) {
    var queryString = averageTestResultSQL.format(func.toUpperCase());
    const values = [framework, test];
    pool.query(queryString, values, (err, res) => {
      //if sql error
      if (err) {
        callback(err, null);
        return;
      }

      var report = {};
      res.rows.forEach(element => {
        report[element.description] = element[func.toLowerCase()];
      });
      callback(null, report);
    });
  }

  getBenchmarkResults(id, callback) {
    pool.query(benchmarkResultSQL, [id], (err, res) => {
      //if sql error
      if (err) {
        console.log(err);
        callback('Database Problem. Please Try Again.',  null);
        return;
      }

      //if report isn't complete
      if (res.rows.length === 0 || res.rows[0].iscomplete === false) {
        const error = 'Benchmark is not complete, or has failed.';
        callback(error, null);
        return;
      }

      // build the json result
      var report = {};
      report.timestamp = res.rows[0].timestamp;
      report.operatingsystem = res.rows[0].operatingsystem;
      report.operatingsystemversion = res.rows[0].operatingsystemversion;
      report.browser = res.rows[0].browser;
      report.browserversion =res.rows[0].browserversion;
      report.hardwaretype = res.rows[0].hardwaretype;
      report.frameworks = {};
      res.rows.forEach(element => {
        if (!report.frameworks[element.frameworkname]) {
          report.frameworks[element.frameworkname] = {};
        }
        if (!report.frameworks[element.frameworkname]["results"]) {
          report.frameworks[element.frameworkname]["results"] = {};
        }
        if (!report.frameworks[element.frameworkname]["results"][element.testdesc]) {
          report.frameworks[element.frameworkname]["results"][element.testdesc] = {};
        }
        report.frameworks[element.frameworkname]["results"][element.testdesc][element.description] = element.floatresult;
        report.frameworks[element.frameworkname]["version"] = element.frameworkversion;
      });

      callback(null, report);
    });
  }
}

module.exports = new ReportingDbAgent();
if (!process.env.SQL_DEBUG) return;
