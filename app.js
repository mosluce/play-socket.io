var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var conn = mongoose.connection;

conn.on('error', console.error);
conn.on('connected', function() {

    var schema = new Schema({}, {strict: false});
    schema.plugin(timestamps);

    global.User = conn.model('User', schema);

    var express = require('express');
    var app = express();
    var server = require('http').createServer(app);
    var io = require('socket.io').listen(server, {});
    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'bower_components')));

    app.use('/', require('./routers'));
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.send(err);
    });

    io.sockets.on('connection', function(socket) {

    });

    server.listen(3000);
});

mongoose.connect(process.env.MONGO_URL);