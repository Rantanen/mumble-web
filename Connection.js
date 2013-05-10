
var fs = require('fs');
var mumble = require('../node-mumble');
var PeerConnection = require('../peerconnection').PeerConnection;

var Connection = function( socket ) {
    console.log( 'New connection' );
    this.socket = socket;
    socket.emit('start');

    var self = this;
    socket.on( 'setname', function( name ) { self.setName(name); } );
    socket.on( 'call', function( sdp ) { self.onCall( sdp ); } );
};

Connection.prototype.setName = function( name ) {
    this.name = name;
}

Connection.prototype.onCall = function( sdp ) {
    var self = this;
    console.log( "New call:" );
    console.log( sdp.sdp );
    var c = new PeerConnection();
    this.peerConnection = c;

    var tlsoptions = null;
    var tlsoptions = {
    };

    mumble.connect( process.env.MUMBLE_ADDR, 64738, tlsoptions, function( err, mumbleConn ) {
        mumbleConn.authenticate( self.name );
        mumbleConn.on( 'initialized', function () {
            self.mumble = mumbleConn;

            c.on( 'iceCandidate', function( evt ) {
                self.socket.emit( 'icecandidate', evt );
            });

            c.on( 'answer', function( evt ) {
                self.socket.emit( 'answer', evt );
            });

            c.on( 'audio', function( evt ) {
                self.mumble.sendVoice( evt.data );
            });

            mumbleConn.on( 'voice', function( evt ) {
                c.transmit( evt.data );
            });

            c.setRemoteDescription( sdp );

            self.socket.on( 'icecandidate', function( evt ) {
                console.log( "Adding ice candidate!" );
                console.dir( evt );
                c.addIceCandidate( evt );
            });
        });
    });
};

module.exports = Connection;
