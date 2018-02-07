// load postgres credentials
require('dotenv').config();

let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

// create main express app
let app = express();

// view engine setup
app.set('views', './views');
app.set('view engine', 'ejs')

app.use(favicon('./public/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('./public'));

// create benchmark server and bind to /benchmark
var http = require('http').Server(app);
var testAgentManager = require('./benchmark_server/BenchmarkAgentManager.js');
testAgentManager = new testAgentManager(http);
var bench = require('./routes/benchmark')(http);
app.use('/benchmark', bench);

// create report endpoint and bind
var bench = require('./routes/report')(http);
app.use('/report', bench);

// start reporting cron jobs
require('./data_access/ReportingJobs');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    'code': err.status,
    'message' : "That's an error.",
    'details' : err.message
  });
});

// start server
var port = process.env.PORT || 3000;
console.log('server listening on port ' + port + '...');
http.listen(port);