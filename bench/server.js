
/**
 * Benchmark dependencies.
 */

var benchmark = require('benchmark')
  , colors = require('colors')
  , ws = require('../lib/websocket.io')
  , suite = new benchmark.Suite('Server');

/**
 * Benchmarks.
 */

suite.add('sending 100 messages', function () {
  ws.listen(4084, function () {
    var client = new Client('ws://127.0.0.1:4084')
    client.on('connected', function () {
      client.close();
      done();
    });
  });
});

if (!module.parent) {
  suite.run();
} else {
  module.exports = suite;
}
