
/**
 * Module dependencies.
 */

var fs = require('fs');
var express = require('express');
var path = require('path');
var http = require('http');
var Connection = require('./Connection');

var app = express();
var server = http.createServer(app)
var io = require('socket.io').listen( server );


// all environments
app.set('port', process.env.PORT || 1234);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

app.get( '/', function( req, res ) {
    res.sendfile( __dirname + '/public/index.html' );
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var connections = [];
io.sockets.on('connection', function (socket) {
    var conn = new Connection( socket );
    connections.push( conn );
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
