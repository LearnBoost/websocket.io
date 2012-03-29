# websocket.io

## Class wsio

This class is exposed by `require('websocket.io')`.

### wsio.version

* String

Protocol revision number

### wsio.protocols

* Object
  * `drafts` Function
  * `hybi` Function

Client constructors for drafts 75/76/00, protocols 7/8/13.

### wsio.listen(port, [fn], [options])

* `port` Number
* `fn` Function
* `options` Object

Creates an `http.Server` which listens on the given port and attaches WS to it. It returns `501 Not Implemented` for regular http requests.

`fn` is the callback for `listen`. The options object can be supplied as second parameter as well. See `wsio.Server` constructor API for `options`.

### wsio.attach(server, [options])

* `server` http.Server
* `options` Object

Captures `upgrade` requests for a `http.Server`. In other words, makes a regular `http.Server` websocket-compatible. See `wsio.Server` constructor API for `options`.

## Class wsio.Server

Is an `EventEmitter`

### new wsio.Server([options])

* `options` Object
  * `path` String
  * `clientTracking` Boolean

Initializes the server. If `path` is set, he server listens only on this path. By default, it listens for `upgrade` events on any path. `clientTracking` enables client tracking (`Server.clients`). Defaults is `true`.

### server.handleUpgrade(req, socket, head)

* `req` http.ServerRequest
* `socket` net.Socket
* `head` Buffer

Handles an incoming request that triggered an `upgrade` event.

### server.clients

* Object

Array of all connected clients

### server.clientsCount

* Number

The number of connected clients

### Event 'connection'

`function (socket) { }`

Fired when a new connection is established.

`socket` is an instance of `wsio.Socket`.


## Class wsio.Socket

Is an `EventEmitter`

### socket.req

* `http.ServerRequest`

Request that originated the connection

### socket.socket

* `net.Socket`

Stream that originated the connection

### socket.send(data)

* `data` String

Writes `data` to the socket.

### socket.close()
### socket.end()

Closes the socket.

### socket.destroy()

Forcibly closes the socket.

### Event 'message'

`function (data) { }`

* `data` String

Fired when data is received

### Event 'error'

`function (error) { }`

### Event 'close'

`function () { }`

Fired when the connection is closed.
