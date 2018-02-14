const ReportingAgent = require('../reporting_server/ReportingAgent');

var report_routes = function(http) {
  var express = require('express');
  var router = express.Router();

  //page to configure tests
  router.get('/', function(req, res) {
        ReportingAgent(req.query, function(err, report) {
          if (err)
          {
            console.log(err)
          }
          // else {
          //   switch(report.type)
          //   {
          //     case("benchmark"):
          //       console.log(1)
          //       res.render('benchmark/report', report);
          //       break;
          //   }
          // }
          res.render('benchmark/report', report);
        });
  });

  return router;
}

module.exports = report_routes;