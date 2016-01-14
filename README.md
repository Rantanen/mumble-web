[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

Mumble client for Node.js
=========================

A browser based Mumble client utilizing WebRTC.

Two-way voice communication works.

UI does not exist.

peerconnection library is prolly completely broken by now thanks to Google's changes to their libraries.

Dependencies
------------

* [node-mumble][] for Mumble protocol handling
* [node-celt][] for Celt encoding
* [node-jitterbuffer][] for jitter buffer
* [peerconnection][] for Node.js WebRTC implementation

[node-mumble]: https://github.com/Rantanen/node-mumble
[node-celt]: https://github.com/Rantanen/node-celt
[node-jitterbuffer]: https://github.com/Rantanen/node-jitterbuffer
[node-peerconnection]: https://github.com/Rantanen/node-peerconnection

