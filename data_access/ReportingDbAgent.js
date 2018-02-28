const pool = new require('pg').Pool();

/*
Allows {#} wildcards in strings to be replaced with values.
Src: https://gist.github.com/darthwade/9310975
*/
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

const averageResultsSQL = 
  "SELECT bf.frameworkname, bft.description as testdesc, bftr.description, AVG(bftr.floatresult), stddev_pop(bftr.floatresult) as stddev \
  FROM benchmarkframeworks bf, benchmarkframeworktests bft, benchmarkframeworktestresults bftr \
  WHERE bf.frameworkid = bft.frameworkid AND bft.testid = bftr.testid \
  GROUP BY bf.frameworkname, bft.description, bftr.description;"

const benchmarkResultSQL =  
  "SELECT timestamp, iscomplete, operatingsystem, operatingsystemversion, browser, browserversion, \
    hardwaretype, frameworkname, frameworkversion, bftr.description, floatresult, \
    bft.description as testdesc \
  FROM benchmarks b, benchmarkframeworks bf, benchmarkframeworktests bft, \
    benchmarkframeworktestresults bftr \
  WHERE b.benchmarkid = bf.benchmarkid AND bf.frameworkid = bft.frameworkid \
    AND bft.testid = bftr.testid AND b.benchmarkid = $1;"

const bencharkFrameworkPercentileSQL = 
  "SELECT * \
  FROM ( \
    SELECT b.benchmarkid, bf.frameworkname, \
      round((RANK() OVER (ORDER BY SUM(bftr.floatresult) ASC NULLS LAST)) / CAST (COUNT(*) OVER () AS DEC), 2) as percentile \
    FROM benchmarks b, benchmarkframeworks bf, benchmarkframeworktests bft, benchmarkframeworktestresults bftr \
    WHERE b.benchmarkid = bf.benchmarkid AND bf.frameworkid = bft.frameworkid AND bft.testid = bftr.testid \
    GROUP BY b.benchmarkid, bf.frameworkname \
    ORDER BY SUM(bftr.floatresult)) as percentiles \
  WHERE benchmarkid = $1;"

/*
Allows access to database to provide reporting access.
Uses a connection pool to handle high volume.
*/
class ReportingDbAgent {

  /*
  Get the average benchmark results for all frameworks and tests.
  Reports the mean and standard deviation.
  */
  getAverageBenchmark(callback) {
    pool.query(averageResultsSQL, function(err, res) {
      //if sql error
      if (err) {
        callback(err, null);
        return;
      }

      // build the json result
      var report = {};
      report.id = "statistics";
      report.frameworks = {};
      res.rows.forEach(function(element) {
        // if statements are required to place empty objects to populate.
        // hideous, but works for now.
        if (!report.frameworks[element.frameworkname]) {
          report.frameworks[element.frameworkname] = {};
        }
        if (!report.frameworks[element.frameworkname]["results"]) {
          report.frameworks[element.frameworkname]["results"] = {};
        }
        if (!report.frameworks[element.frameworkname]["results"][element.testdesc]) {
          report.frameworks[element.frameworkname]["results"][element.testdesc] = {};
        }
        report.frameworks[element.frameworkname]["results"][element.testdesc][element.description] = {}
        report.frameworks[element.frameworkname]["results"][element.testdesc][element.description]
          ["avg"] = element.avg;
          report.frameworks[element.frameworkname]["results"][element.testdesc][element.description]
          ["stddev"] = element.stddev;
      });
      callback(null, report);
    });
  }

  /* 
  Gets the benchmark results for a certain benchmark run. Requires the benchmark id requested,
  and the callback(result) function.
  */
  getBenchmarkResults(id, callback) {
    pool.query(benchmarkResultSQL, [id], function (err, res) {
      // if sql error
      if (err) {
        console.log(err);
        callback('Database Problem. Please Try Again.',  null);
        return;
      }

      // if report isn't complete
      if (res.rows.length === 0 || res.rows[0].iscomplete === false) {
        const error = 'Benchmark is not complete, or has failed.';
        callback(error, null);
        return;
      }

      // build the json result
      var report = {};
      report.id = id;
      report.timestamp = res.rows[0].timestamp;
      report.operatingsystem = res.rows[0].operatingsystem;
      report.operatingsystemversion = res.rows[0].operatingsystemversion;
      report.browser = res.rows[0].browser;
      report.browserversion =res.rows[0].browserversion;
      report.hardwaretype = res.rows[0].hardwaretype;
      report.frameworks = {};
      res.rows.forEach(function(element) {
        // if statements are required to place empty objects to populate.
        // hideous, but works for now.
        if (!report.frameworks[element.frameworkname]) {
          report.frameworks[element.frameworkname] = {};
        }
        if (!report.frameworks[element.frameworkname]["results"]) {
          report.frameworks[element.frameworkname]["results"] = {};
        }
        if (!report.frameworks[element.frameworkname]["results"][element.testdesc]) {
          report.frameworks[element.frameworkname]["results"][element.testdesc] = {};
        }
        report.frameworks[element.frameworkname]["results"][element.testdesc][element.description] 
          = element.floatresult;
        report.frameworks[element.frameworkname]["version"] = element.frameworkversion;
      });

      // get percentile calculation
      pool.query(bencharkFrameworkPercentileSQL, [id], function (err, res) {
        // if sql error
        if (err) {
          console.log(err);
          callback('Database Problem. Please Try Again.',  null);
          return;
        }

        res.rows.forEach(function(row) {
          report.frameworks[row.frameworkname]["percentile"] = row.percentile;
        });

        callback(null, report);
      });
    });
  }
}

module.exports = new ReportingDbAgent();
