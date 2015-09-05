// Express server setup
var express 		= require('express');
var app 			= express();

// Required modules
var path 			= require('path');
var favicon 		= require('serve-favicon');
var logger 			= require('morgan');
var cookieParser 	= require('cookie-parser');
var bodyParser 		= require('body-parser');
var session			= require('express-session');
var mongoose 		= require('mongoose');
var passport 		= require('passport');
var flash 			= require('connect-flash');
var multer			= require('multer');

// Configuration ==============================================================================

// Mongoose setup
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
// Passport setup
require('./config/passport.js')(passport);

// View Engine Setup - Jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Module Use Setup
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'scotchscotchscotch', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//app.use(multer({ dest: './public/uploads/'}));

// Path section
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));

// Routes ====================================================================================
require('./app/routes.js')(app, passport);

// Error handlers ============================================================================
	// Catch 404 and forward to error handler
	app.use(function(req, res, next) {var err = new Error('Not Found'); err.status = 404; next(err)});
	// Development error handler will print stacktrace
	if (app.get('env') === 'development') {app.use(function(err, req, res, next) {res.status(err.status || 500); res.render('error', {message: err.message, error: err});});}
	// production error handler - no stacktraces leaked to user
	app.use(function(err, req, res, next) {res.status(err.status || 500); res.render('error', { message: err.message, error: {} });});


module.exports = app;
