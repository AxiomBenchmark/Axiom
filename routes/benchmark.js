module.exports = function(http) {
  var express = require('express');
  var router = express.Router();
  
  router.get('/', function(req, res) {
    console.log('looking up id...');
    console.log('not implemented.');

    var fake = {
      title: 'asdasdsad',
      rt: '/javascript/test/fakework.js'
    };

    req.re
  });

  router.get('/:test', function(req, res) {
    console.log('looking up id...');
    console.log('not implemented.');

    var fake = {
      title: 'asdasdsad',
      rt: '/javascript/test/fakework.js'
    };
    
    res.render('benchmark/client', fake);
  });

  return router;
}
