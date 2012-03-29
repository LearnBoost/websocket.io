
/**
 * Module dependencies.
 */

var EventEmitter = process.EventEmitter

/**
 * Module exports.
 */

module.exports = Socket;

/**
 * Abtract Socket class.
 *
 * @param {http.Request} the node.js http Request
 * @api private
 */

function Socket (req) {
  this.req = req;
  this.socket = req.socket;

  var self = this;
  this.socket
    .on('error', function (e) {
      self.emit('error', e);
      self.destroy();
    })
    .on('end', function () {
      self.close();
    })
    .on('close', function () {
      self.onClose();
    })
    .on('timeout', function() {
      self.destroy();
    })

  this.open = true;
  this.onOpen();
}

/**
 * Inherits from EventEmitter.
 */

Socket.prototype.__proto__ = EventEmitter.prototype;

/**
 * Request that originated the connection.
 *
 * @api public
 */

Socket.prototype.req;

/**
 * Stream that originated the connection.
 *
 * @api public
 */

Socket.prototype.socket;

/**
 * Called upon socket close.
 *
 * @return {Socket} for chaining.
 * @api private
 */

Socket.prototype.onClose = function () {
  if (this.open) {
    this.open = false;
    this.emit('close');
  }

  return this;
};

/**
 * Handles a message.
 *
 * @param {String} message
 * @return {Socket} for chaining
 * @api public
 */

Socket.prototype.onMessage = function (msg) {
  this.emit('message', msg);
  return this;
};

/**
 * Writes to the socket.
 *
 * @return {Socket} for chaining
 * @api public
 */

Socket.prototype.send = function (data) {
  this.write(data);
  return this;
};

/**
 * Closes the connection.
 *
 * @api public
 */

Socket.prototype.close = Socket.prototype.end = function () {
  if (this.open) {
    this.socket.end();
    var self = this;
    process.nextTick(function () {
      self.onClose();
    });
  }
  return this;
};

/**
 * Destroys the connection.
 *
 * @api public
 */

Socket.prototype.destroy = function () {
  if (this.open) {
    this.socket.destroy();
    this.onClose();
  }
  return this;
};
