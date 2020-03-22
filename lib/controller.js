/*!
 * lib/controller.js
 * i-n-v-e-n-t-u-r-a (https://github.com/dstegen/i-n-v-e-n-t-u-r-a)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/i-n-v-e-n-t-u-r-a/blob/master/LICENSE)
 */

const execSync = require('child_process').execSync;

const model = require('./model');
const deliver = require('./deliver');
const view = require('./view');

function controller (request, wss, wsport) {
  if (request.url.includes('media') || request.url.includes('node_modules') || request.url.includes('public')) {
		return deliver(request);
	} else if (request.url.includes('update')) {
    model.updateItem(request);
    //wsFeddback(wss, 'UPDATED');
    return {
      statusCode: 302,
      contentType: 'text/html; charset=UTF-8',
      cookie: [],
      location: '/',
      data: ''
    }
  } else if (request.url.includes('additem')) {
    model.addItem(request);
    //wsFeddback(wss, 'ADDED');
    return {
      statusCode: 302,
      contentType: 'text/html; charset=UTF-8',
      cookie: [],
      location: '/',
      data: ''
    }
  } else if (request.url.includes('poweroff')) {
    execSync('sudo poweroff');
  } else if (request.url.includes('reboot')) {
    execSync('sudo reboot');
  } else {
    return view(model.initModel(), wsport, request.headers['accept-language'].split(',')[0]);
  }
}


// Additional functions

function wsFeddback (wss, txt) {
  wss.clients.forEach(function each(client) {
    setTimeout(function () {
      client.send(txt);
    }, 100);
  });
}

module.exports = controller;
