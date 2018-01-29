const { CronJob } = require('cron');
const { Pool } = require('pg');
var pool = Pool();

const DeleteUnfinishedResultsSQL = "DELETE FROM benchmarkframeworktestresults bftr \
                                    WHERE bftr.testid IN (\
                                            SELECT bft.testid FROM benchmarkframeworktests bft\
                                            WHERE bft.frameworkid IN (\
                                                    SELECT bf.frameworkid\
                                                    FROM benchmarkframeworks bf \
                                                    WHERE bf.benchmarkid\
                                                    IN (\
                                                            SELECT b.benchmarkid \
                                                            FROM benchmarks b \
                                                            WHERE NOT b.iscomplete)));";
const DeleteUnfinishedTestsSQL = "DELETE FROM benchmarkframeworktests bft\
                                WHERE bft.frameworkid IN (\
                                        SELECT bf.frameworkid\
                                        FROM benchmarkframeworks bf \
                                        WHERE bf.benchmarkid IN (\
                                                SELECT b.benchmarkid \
                                                FROM benchmarks b \
                                                WHERE NOT b.iscomplete));"
const DeleteUnfinishedFrameworksSQL = "DELETE FROM benchmarkframeworks bf \
                                        WHERE bf.benchmarkid IN (\
                                                SELECT b.benchmarkid \
                                                FROM benchmarks b \
                                                WHERE NOT b.iscomplete);"
const DeleteUnfinishedBenchmarksSQL = "DELETE FROM benchmarks b WHERE NOT b.iscomplete;"

//Every Sunday at Midnight, delete unfinished benchmarks
new CronJob('12 0 * * 7', function() {
    console.log('clearing DB of unfinished benchmarks...');
    pool.query(DeleteUnfinishedResultsSQL).then(function() {
        pool.query(DeleteUnfinishedTestsSQL).then(function() {
            pool.query(DeleteUnfinishedFrameworksSQL).then(function() {
                pool.query(DeleteUnfinishedBenchmarksSQL).then(function() {
                    console.log('...done!');
                })
            });
        });
    });
}, null, true, 'America/Los_Angeles');