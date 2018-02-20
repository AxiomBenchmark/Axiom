const ReportingAgent = require('../reporting_server/ReportingAgent');

var report_routes = function(http) {
  var express = require('express');
  var router = express.Router();

  //page to configure tests
  router.get('/', function(req, res) {
        ReportingAgent(req.query, function(err, report) {

          console.log('\n\n\nerror:\n' + err);
          console.log('\n\n\report:\n' + report);

          if (err)
          {
            res.render('error', {"error" : err});
          }
          else
          {
            console.log(report);
            res.render('benchmark/report', report);
          }
        });
  });

  return router;
}

module.exports = report_routes;