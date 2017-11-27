module.exports = function(http) {
  var express = require('express');
  var router = express.Router();

  //page to configure tests
  router.get('/configure', function(req, res) {
    
        var testOptions = include('contract.js');
        console.log(testOptions);
        res.render('benchmark/options', testOptions);
  });

  router.get('/run', function(req, res) {

    console.log(req.query.react ===  'on');
    var fake = {
      title: 'Fakework',
      rt: '/javascript/test/fakework.js'
    };
    
    res.render('benchmark/client', fake);
  });

  return router;
}
