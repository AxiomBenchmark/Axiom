module.exports = function(http) {
  var express = require('express');
  var router = express.Router();

  //page to configure tests
  router.get('/configure', function(req, res) {
    
        var testOps = include('fakeTestProfiles.json');
        var names = [];
        testOps.forEach(element => {
          var ele = {
            'name' : element.framework,
            'id' : element.id
          };
          names = names.concat(ele);
        });
        var params = {
          'testdefs' : names
        };
        res.render('benchmark/configure', params);
  });

  router.get('/run', function(req, res) {

    console.log(req.query.react ===  'on');
    var fake = {
      title: 'Fakework',
      rt: '/testapps_bin/react.js'
    };
    
    res.render('benchmark/client', fake);
  });

  return router;
}
