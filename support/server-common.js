
/**
 * Common dependencies.
 */

var ws = require('../lib/websocket.io')
  , Client = require('easy-websocket')

/**
 * Creates a http.Server that listens on an ephemeral port.
 *
 * @api public
 */

listen = function (options, fn) {
  if ('function' == typeof options) {
    fn = options;
    options = {};
  }

  var w = new ws.Server(options)
    , server = require('http').createServer()

  server.listen(function (err) {
    if (err) throw err;
    fn(server.address(), w);
  });

  server.on('upgrade', function (req, socket, head) {
    w.handleUpgrade(req, socket, head);
  });

  // shortcut for closing the actual server
  w.close = function () {
    server.close();
  }

  return w;
}

/**
 * Creates a client for the given address.
 *
 * @api public
 */

client = function (addr, path) {
  var cl = new Client('ws://' + addr.address + ':' + addr.port + (path || ''));
  cl.on('error', function (e) {
    throw e;
  });
  return cl;
}
