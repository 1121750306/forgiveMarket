var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var base = require("./models/base");
var index = require('./routes/index');
var users = require('./routes/users');
var good = require('./routes/good');
var goodtype = require('./routes/goodtype');
var order = require('./routes/order');
var locations=require('./routes/location');
var admin=require("./routes/admin");
var history = require("./routes/history");
var goodInfo = require("./routes/goodInfo");
var goodphoto = require("./routes/goodphoto");
var collect = require("./routes/collect");
var comment=require("./routes/comment");
var server=require("./routes/server");
//传递models
base.initModels(function(models) {
	users.callback(models);
	history.callback(models);
	collect.callback(models);
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(cookieParser("sessiontest"));
app.use(session({
	secret: "sessiontest",
	resave: true,
	saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use('/', index);
app.use('/users', users);
app.use('/good',good);
app.use('/goodtype',goodtype);
app.use('/order', order);
app.use('/location',locations);
app.use('/admin',admin);
app.use('/history',history);
app.use('/goodInfo',goodInfo);
app.use('/collect',collect);
app.use('/goodphoto',goodphoto);
app.use('/comment',comment);
app.use("/server",server);
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
	res.render('error');
});

module.exports = app;
