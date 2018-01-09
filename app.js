global.abs_path = function(path) {
  return __dirname + path;
}
global.include = function(file) {
  return require(abs_path('/' + file));
}

let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

// create main express app
let app = express();

// create reporting app and bind to /reporting
var reportingApp = express();
app.use('/reporting', reportingApp);

// configure jsreport engine
let jsreport = require('jsreport')({
  express: { app: reportingApp },
  appPath: '/reporting'
});

// initialize jsreport
jsreport.init().catch(function (e) {
  console.error(e);
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// uncomment after placing our favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// create benchmark server and bind to /benchmark
var http = require('http').Server(app);
var testAgentManager = require(path.join(__dirname, 'TestAgentManager.js'));
testAgentManager = new testAgentManager(http);
var bench = include('routes/benchmark')(http);
app.use('/benchmark', bench);

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
