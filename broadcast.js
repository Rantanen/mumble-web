
var mumble = require('mumble');
var EventEmitter = require('events').EventEmitter;

var child_process = require('child_process');

var pendingEvents = new EventEmitter();

var clients = {};
var clientPending = {};

var getClient = function( path, done ) {
    if( clients[ path ] ) {
        return done( null, clients[path] );
    }

    pendingEvents.once( 'client-' + path, function( client ) {
        done( null, client );
    });

    if( clientPending[ path ] ) { return; }

    mumble.connect( process.env.MUMBLE_ADDR, function( err, mumbleConn ) {
        mumbleConn.authenticate('Drone-' + Date.now());

        mumbleConn.once('initialized', function () {
            clientPending[ path ] = false;
            clients[ path ] = mumbleConn;
            pendingEvents.emit( 'client-' + path, mumbleConn );
        });
    });
    clientPending[ path ] = true;
};

var streams = {};
var streamPending = {};
var getStream = function( path, done ) {
    getClient( path, function( err, client ) {
        done( err, client.outputStream() );
    });
};

exports.broadcast_mp3 = function( path, req, res ) {
    res.writeHead(200, { 'Content-Type': 'audio/mpeg' });
    var lame = child_process.spawn( 'lame', [ '-r', '-s', '48', '-m', 'm', '-', '-' ] );
    exports.broadcast( path, req, res, lame );
}

exports.broadcast_vorbis = function( path, req, res ) {
    res.writeHead(200, { 'Content-Type': 'audio/vorbis' });
    var ogg = child_process.spawn( 'oggenc', [ '-r', '-R', '48000', '-C', '1', '-' ] );
    exports.broadcast( path, req, res, ogg );
}

exports.broadcast = function( path, req, res, encoder ) {
    getStream( path, function( err, stream ) {

        // Streams \o/
        stream.pipe( encoder.stdin );
        encoder.stdout.pipe( res );
    });
}
