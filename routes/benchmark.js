// available tests are configured in TestProfiles.json
const TestLibrary = require('../TestProfiles.json');

// build options for configuration page
var options = [];
TestLibrary.forEach(element => {
  var ele = {
    'name' : element.framework,
    'id' : element.id
  };
  options = options.concat(ele);
});

var benchmark_routes = function(http) {
  var express = require('express');
  var router = express.Router();

  //page to configure tests
  router.get('/configure', function(req, res) {

        var params = {
          'frameworks' : options
        };

        res.render('benchmark/configure', params);
  });

  router.get('/run', function(req, res) {
    res.render('benchmark/client', null);
  });

  return router;
}

module.exports = benchmark_routes;