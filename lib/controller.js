/*!
 * lib/controller.js
 * inventura
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT
 */

const model = require('./model');
const deliver = require('./deliver');
const view = require('./view');

function controller (request, wss, wsport) {
  if (request.url.includes('media') || request.url.includes('node_modules') || request.url.includes('public')) {
		return deliver(request);
	} else if (request.url.includes('update')) {
    model.updateItem(request);
    return {
      statusCode: 302,
      contentType: 'text/html; charset=UTF-8',
      cookie: [],
      location: '/',
      data: ''
    }
  } else if (request.url.includes('additem')) {
    model.addItem(request);
    return {
      statusCode: 302,
      contentType: 'text/html; charset=UTF-8',
      cookie: [],
      location: '/',
      data: ''
    }
  } else {
    return view(model.initModel());
  }
}

module.exports = controller;
