/*!
 * index.js
 * i-n-v-e-n-t-u-r-a (https://github.com/dstegen/i-n-v-e-n-t-u-r-a)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/i-n-v-e-n-t-u-r-a/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const http = require('http');
const WebSocket = require('ws');
const {getIPs} = require('webapputils-ds');
const router = require('./lib/router');

let port = 8080;
let wsport = 8080;
let host = 'localhost';
if (getIPs()['en0']) {
  host = getIPs()['en0'];
} else if (getIPs()['wlo1']) {
  host = getIPs()['wlo1'];
} else if (getIPs()['eth0']) {
  host = getIPs()['eth0'];
  port = 80;
  wsport = 80;
}
console.log('Available network devices: ');
console.log(getIPs());

const server = http.createServer( function (request, response) {
  router(request, response, wss, wsport);
}).listen(port, host, () => console.log('i-n-v-e-n-t-u-r-a is online: http://'+host+':'+port+' (wsport:'+wsport+')'));

const wss = new WebSocket.Server({
  server,
  clientTracking: true
});
