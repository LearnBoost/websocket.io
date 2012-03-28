
/*!
 * websocket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module requirements.
 */

var Socket = require('../socket')
  , WebSocketServer = require('ws').Server;

/**
 * Export the constructor.
 */

exports = module.exports = WebSocket;

/**
 * HTTP interface constructor. Interface compatible with all transports that
 * depend on request-response cycles.
 *
 * @api public
 */

function WebSocket (server, req) {
  var self = this;
  this.wss = new WebSocketServer({
      noServer: true
    , clientTracking: false
  });
  Socket.call(this, server, req);
};

/**
 * Inherits from Socket.
 */

WebSocket.prototype.__proto__ = Socket.prototype;

/**
 * Transport name
 *
 * @api public
 */

WebSocket.prototype.name = 'websocket';

/**
 * Websocket draft version
 *
 * @api public
 */

WebSocket.prototype.protocolVersion = 'hybi';

/**
 * Called when the socket connects.
 *
 * @api private
 */

WebSocket.prototype.onOpen = function () {
  var self = this;

  this.wss.handleUpgrade(this.req, this.socket, this.req.head, function(ws) {
    self.ws = ws;

    ws.on('message', function(message) {
      self.onMessage(message);    
    });
    ws.on('close', function () {
      self.end();
    });
    ws.on('error', function (reason) {
      //self.log.warn(self.name + ' parser error: ' + reason);
      self.end();
    });
  });
};

/**
 * Writes to the socket.
 *
 * @api private
 */

WebSocket.prototype.write = function (data) {
  if (this.open && this.ws) {
    this.ws.send(data);
    //this.log.debug(this.name + ' writing', data);
  }
};

/**
 * Writes a payload.
 *
 * @api private
 */

WebSocket.prototype.payload = function (msgs) {
  for (var i = 0, l = msgs.length; i < l; i++) {
    this.write(msgs[i]);
  }
  return this;
};
