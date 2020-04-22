/*!
 * index.js
 * i-n-v-e-n-t-u-r-a (https://github.com/dstegen/i-n-v-e-n-t-u-r-a)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/i-n-v-e-n-t-u-r-a/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const {ServerDS} = require('webapputils-ds');
const router = require('./lib/router');

// Name the process
process.title = 'i-n-v-e-n-t-u-r-a';

let port = 8080;

try {
	if (process.argv[2] && process.argv[2].includes('port')) {
		port = Number(process.argv[2].split('=')[1]);
	}
} catch (e) {
	console.log('ERROR reading port number from command line: '+e);
}

const server = new ServerDS('i-n-v-e-n-t-u-r-a', port);
server.setCallback(router);
server.startServer();
