// Call all the packages that we want to use
var express 	= require('express');
var app 		= express();
var morgan		= require('morgan');
var mongoose	= require('mongoose');
var bodyParser	= require('body-parser');
var path		= require('path');
var config		= require('./config');

// REAL TIME WORK
var http 		= require('http').Server(app);
var io 			= require('socket.io')(http);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// log our request to our terminal
app.use(morgan('dev'));

// Connect to our database using mongoose
mongoose.connect(config.database, function(err) {
	if(err) {
		console.log("Connection to a mongodb database has failed");
	} else {
		console.log("Connected to a database");
	}
});


// set our static files to a designated location
app.use(express.static(__dirname + '/public'));

var apiRouter = require('./app/routes/api') (app, express, io);
app.use('/api', apiRouter);

// registered before your api routes.
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

http.listen(config.port, function(err) {
    if(err) {
    	console.log("There's an error connecting the app to port" + config.port);
    } else {
    	console.log("App is listening on port " + config.port);
    }
});
