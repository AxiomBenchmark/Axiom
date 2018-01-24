const { Pool } = require('pg');

// connection pool to handle lots of requests.
const pool = new Pool();

const averageTestResultSQL = 
  "SELECT bftr.description, AVG(bftr.floatresult)\
  FROM benchmarkframeworks bf, benchmarkframeworktests bft, benchmarkframeworktestresults bftr\
  WHERE bf.frameworkid = bft.frameworkid AND \
        bft.testid = bftr.testid AND \
        bf.frameworkname = $1 \
        AND bft.description = $2\
  GROUP BY bftr.description;"

class ReportingDbAgent {

  //get the average of a certain tests results.
  getTestAverage(framework, test, callback) {
    const values = [framework, test];
    pool.query(averageTestResultSQL, values, (err, res) => {
      var report = {};
      res.rows.forEach(element => {
        report[element.description] = element.avg;
      });
      console.log(report);
    });
  }
}

module.exports = new ReportingDbAgent();
module.exports.getTestAverage('React', 'Lifecycle Test A');