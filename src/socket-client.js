const {DEBUG, PORT} = require('../common/constants')
const io = require('socket.io-client')

let sockets = []

const _connect = () => {
	const socket = io.connect('http://localhost:' + PORT, {forceNew: true})
	sockets.push(socket)
	return socket
}

exports.disconnect = () => {
	sockets.forEach(s => { s.disconnect() })
}

const _shutdown = (socket) => {
	socket.disconnect()
	return socket._tabs
}

/* Connects to the socket server */

exports.query = function (room, appName, qrStr) {
	const socket = _connect()

	return new Promise((resolve, reject) => {
		socket.on('connect', function () {
			if (DEBUG) console.log('Client connected')

			socket.emit('join', room)

			socket._tabs = undefined
			if (DEBUG) console.log('requestor query to replier', qrStr)
			socket.emit('message', {
				room: room,
				appName: appName,
				cmd: 'query',
				data: qrStr,
			})
			setTimeout(() => { resolve(_shutdown(socket)) }, 100)
		})

		socket.on('message', data => {
			socket._tabs = (JSON.parse(data.result))
			if (DEBUG) console.log(socket._tabs)
			resolve(_shutdown(socket))
		})
	})
}

exports.afterActions = (room, appName, cmd, item) => {
	const socket = _connect()

	return new Promise((resolve, reject) => {
		socket.on('connect', function () {
			if (DEBUG) console.log('Client connected')

			socket.emit('join', room)

			if (DEBUG) console.log('requestor query to replier', qrStr)
			socket.emit('message', {
				room: room,
				appName: appName,
				cmd: cmd,
				data: item,
			})
			setTimeout(() => { resolve(socket.disconnect()) }, 100)
		})
	})
}
