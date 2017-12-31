#!/usr/bin/env node
'use strict'

const {PORT} = require('../../common/constants')

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(PORT)

io.on('connection', function (socket) {
	socket.emit('news', {hello: 'world'})
	socket.on('my other event', function (data) {
		console.log(data)
	})

	socket.on('join', room => {
		socket.join(room)
		console.log(socket.client.id, 'joined room', room)
	})

	socket.on('message', data => {
		console.log('broker got message', data.room, data.cmd,
			JSON.stringify(data.result))
		socket.to(data.room).emit('message', data)
	})
})

