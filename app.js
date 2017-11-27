global.abs_path = function(path) {
  return __dirname + path;
}
global.include = function(file) {
  return require(abs_path('/' + file));
}

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// uncomment after placing our favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'faicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))

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

http.listen(3000);
