#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('child-tracker-backend:server');
var https = require('https');
const fs = require('fs');
const crypto = require('crypto');
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort('443');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = https.createServer(app);
console.log(fs.readFileSync(__dirname + '\\privatekey.pem', 'utf-8'))
const buff = Buffer.from(fs.readFileSync(__dirname + '\\publickey509.pem'), "base64");
        // decode buffer as UTF-8
const decodePublicKey = buff.toString("utf-8");
const passphrase = '1234';
const encryptedPrivateKey = fs.readFileSync(__dirname + '\\privatekey.pem');
const privateKey = crypto.createPrivateKey({
	key: encryptedPrivateKey,
	passphrase: passphrase,
});

https
	.createServer(
		{
			key: privateKey,
			cert: fs.readFileSync(__dirname + '\\publickey509.pem'),
		},
		app
	)
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
	console.log(`Application listening on port ${port}`);
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	debug('Listening on ' + bind);
}
