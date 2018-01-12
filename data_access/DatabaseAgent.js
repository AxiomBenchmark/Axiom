const { Pool } = require('pg');
const BenchmarkIdGenerator = require('./BenchmarkIdGenerator');

// connection pool to handle lots of requests.
const pool = new Pool();

// sql strings
const verifyUniqueIdSQL = 
  "SELECT COUNT(*) FROM benchmarks WHERE benchmarkid = $1";
const newBenchmarkSQL = 
  "INSERT INTO benchmarks (benchmarkid, operatingsystem, operatingsystemversion, browser, browserversion, hardwaretype, engine, engineversion)\
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8);";
const newFrameworkSQL =
  "INSERT INTO benchmarkframeworks (benchmarkid, frameworkname, frameworkversion)\
   VALUES ($1, $2, $3) RETURNING frameworkid;"
const newResultSQL_float = 
  "INSERT INTO benchmarkframeworkresults (frameworkid, testid, resultdesc, floatresult)\
   VALUES ($1, $2, $3, $4);"
const newResultSQL_string = 
  "INSERT INTO benchmarkframeworkresults (frameworkid, testid, resultdesc, stringresult)\
   VALUES ($1, $2, $3, $4);"
const completeBenchmarkSQL =
  "UPDATE benchmarks SET iscomplete = TRUE WHERE benchmarkid = $1 ;"

class DatabaseAgent {

  // generate a unique id.
  // in the 1 in ~17 billion chance of a collision, recalculate.
  generateUniqueId(callback) {
    const id = BenchmarkIdGenerator();
    this.verifyUniqueId(id, (unique) => {
      if (!unique) {
        this.generateUniqueId(callback);
      }
      else {
        callback(id);
      }
    });
  }

  // verify that the id is not in use.
  verifyUniqueId(id, callback) {
    const res = pool.query(verifyUniqueIdSQL, [id], (err, res) => {
      if (err) {
        console.log(err);
        callback(false);
      } else {
        callback(res.rows[0].count === '0');
      }
    });
  }

  // add a new benchmark.
  newBenchmark(os, osv, browser, browserv, hardwaretype, engine, enginev, callback) {
    const id = this.generateUniqueId((id) => {
      const values = [id, os, osv, browser, browserv, hardwaretype, engine, enginev];
      pool.query(newBenchmarkSQL, values).then(res => {
        callback(id);
      });
    });
  }

  // add a new framework to a benchmark.
  newFramework(benchmarkid, fwname, fwversion, callback) {
    const values = [benchmarkid, fwname, fwversion];
    pool.query(newFrameworkSQL, values).then(res => {
      callback(res.rows[0].frameworkid);
    });
  }

  // add a new result to a framework
  newResult(frameworkid, testid, testdesc, result) {
    var querystring = newResultSQL_float;
    if (parseFloat(result) === NaN) {
      querystring = newResultSQL_string;
    }
    const values = [frameworkid, testid, testdesc, result];
    pool.query(querystring, values);
  }

  // make the benchmark as complete
  completeBenchmark(id) {
    pool.query(completeBenchmarkSQL, [id]);
  }
}

module.exports = new DatabaseAgent();