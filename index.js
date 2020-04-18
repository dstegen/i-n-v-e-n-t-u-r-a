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

const server = new ServerDS('i-n-v-e-n-t-u-r-a');
server.setCallback(router);
server.startServer();
