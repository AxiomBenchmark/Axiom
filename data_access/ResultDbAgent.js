const pool = new require('pg').Pool();
const BenchmarkIdGenerator = require('./BenchmarkIdGenerator').generate;

const verifyUniqueIdSQL = "SELECT COUNT(*) FROM benchmarks WHERE benchmarkid = $1";

const newBenchmarkSQL =  
  "INSERT INTO benchmarks (benchmarkid, operatingsystem, operatingsystemversion, browser, \
    browserversion, hardwaretype, engine, engineversion) \
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8);";

const newFrameworkSQL = 
  "INSERT INTO benchmarkframeworks (benchmarkid, frameworkname, frameworkversion) \
  VALUES ($1, $2, $3) \
  RETURNING frameworkid;"

const newTestSQL = 
  "INSERT INTO benchmarkframeworktests (frameworkid, description) \
   VALUES ($1, $2) RETURNING testid;"

const newResultSQL = 
  "INSERT INTO benchmarkframeworktestresults (testid, name, description, floatresult) \
   VALUES ($1, $2, $3, $4);"

const completeBenchmarkSQL =
  "UPDATE benchmarks SET iscomplete = TRUE WHERE benchmarkid = $1 ;"

/*
Allows access to database to provide result ingestion.
Uses a connection pool to handle high volume.
*/
class ResultDbAgent {
  /*
  Generates a unique Benchmark Id in the form of AAA-###-AAA. In the 1 in ~17 billion chance of a 
  collision, recalculate.
  */
  generateUniqueId(callback) {
    const id = BenchmarkIdGenerator();
    this.verifyUniqueId(id, function(unique) {
      if (!unique) {
        this.generateUniqueId(callback);
      }
      else {
        callback(id);
      }
    });
  }

  /*
  Verifies that the provided Id is not already in use. Requires a callback(isUnique) function.
  */
  verifyUniqueId(id, callback) {
    const res = pool.query(verifyUniqueIdSQL, [id], function(err, res) {
      if (err) {
        console.log(err);
        callback(false);
      } else {
        callback(res.rows[0].count === '0');
      }
    });
  }

  /*
  Adds a new benchmark into the database. Requries all the user info provided by their UserAgent,
  and a callback(id) function.
  */
  newBenchmark(os, osv, browser, browserv, hardwaretype, engine, enginev, callback) {
    const id = this.generateUniqueId(function(id) {
      const values = [id, os, osv, browser, browserv, hardwaretype, engine, enginev];
      pool.query(newBenchmarkSQL, values).then(function(res) {
        callback(id);
      });
    });
  }

  /*
  Adds a new framework to an existing benchmark. Requires the benchmark id to add the result to, 
  the framework name and version, and a callback(frameworkid) function.
  */
  newFramework(benchmarkid, fwname, fwversion, callback) {
    const values = [benchmarkid, fwname, fwversion];
    pool.query(newFrameworkSQL, values).then(function(res) {
      callback(res.rows[0].frameworkid);
    });
  }

  /*
  Adds a new test to an existing framework being tested. Requires the framework id provided by 
  newFrameWork() above, the test description, and a callback(testid) function.
  */
  newTest(frameworkid, description, callback) {
    console.log('newTest');
    const values = [frameworkid, description];
    pool.query(newTestSQL, values).then(function(res) {
      callback(res.rows[0].testid);
    });
  }

  /*
  Adds a result to an existing test being tested. Requires the test id provided by newTest() above,
  description of what the test tested, and the actual result of the test. Currently only numeric
  results are accepted.
  */
  newResult(testid, name, description, result) {
    const values = [testid, name, description, result];
    pool.query(newResultSQL, values);
  }

  /*
  Marks the given benchmark id as complete in the database. This validates the benchmark results
  and results in permanent storage. 
  */
  completeBenchmark(id) {
    pool.query(completeBenchmarkSQL, [id]);
  }
}

module.exports = new ResultDbAgent();