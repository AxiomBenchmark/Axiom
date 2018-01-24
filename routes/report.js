const ReportingAgent = require('../reporting_server/ReportingAgent');

var report_routes = function(http) {
  var express = require('express');
  var router = express.Router();

  //page to configure tests
  router.get('/', function(req, res) {
        ReportingAgent(req.query, (report) => {
          res.render('benchmark/report', report);
          res.end();
        });
  });

  return router;
}

module.exports = report_routes;