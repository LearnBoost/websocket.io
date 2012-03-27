
/**
 * Module dependencies.
 */

var protocols = require('./protocols')
  , EventEmitter = process.EventEmitter
  , url = require('url')
  , Logger = require('./logger')

/**
 * Module exports.
 */

module.exports = Server;

/**
 * Constructor. HTTP Server agnostic.
 *
 * @api public
 */

function Server (options) {
  this.options = {
      path: null
    , logger: new Logger()
    , clientTracking: true
  };

  for (var i in options) {
    this.options[i] = options[i];
  }

  this.clients = [];
  this.clientsCount = 0;
  this.log = this.options.logger;
}

/**
 * Inherits from EventEmitter.
 */

Server.prototype.__proto__ = EventEmitter.prototype;

/**
 * Logger interface.
 *
 * @api public
 */

Server.prototype.log;

/**
 * Handles a Request after `upgrade` event.
 *
 * @param {http.Request} request object
 * @param {http.Stream} socket
 * @param {Buffer} data stream head
 * @return {Server} for chaining.
 * @api public
 */

Server.prototype.handleUpgrade = function (req, socket, head) {
  var i = this.clients.length
    , self = this;

  if (! this.checkRequest(req)) {
    return this;
  }

  // attach the legacy `head` property to request
  req.head = head;

  var client = this.createClient(req);

  if (client.open) {
    if (this.options.clientTracking) {
      this.clients.push(client);
      this.clientsCount++;

      client.on('close', function () {
        self.clients[i] = null;
        self.clientsCount--;
      });
    }

    self.emit('connection', client);
  }

  return this;
};

/**
 * Checks whether the request path matches.
 *
 * @return {Bool}
 * @api private
 */

Server.prototype.checkRequest = function (req) {
  if (this.options.path) {
    var u = url.parse(req.url);
    if (u && u.pathname !== this.options.path) return false;
  }

  // no options.path => match all paths
  return true;
};

/**
 * Initializes a client for the request with appropriate protocol.
 *
 * @param {http.Request} request object
 * @api private
 */

Server.prototype.createClient = function (req) {
  var version = req.headers['sec-websocket-version']
    , name = protocols[version] ? version : 'drafts'

  return new protocols[name](this, req);
};
