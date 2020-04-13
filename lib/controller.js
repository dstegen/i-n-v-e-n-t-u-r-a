/*!
 * lib/controller.js
 * i-n-v-e-n-t-u-r-a (https://github.com/dstegen/i-n-v-e-n-t-u-r-a)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/i-n-v-e-n-t-u-r-a/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const execSync = require('child_process').execSync;
const {uniSend, getFormObj, SendObj} = require('webapputils-ds');
const model = require('./model');
const view = require('../views/view');


function webView (request, response, wss, wsport) {
  uniSend(view(model.initModel(), wsport, request.headers['accept-language'].split(',')[0]), response);
}

function update (request, response) {
  model.updateItem(request);
  uniSend(new SendObj(302), response);
}

function addItem (request, response) {
  model.addItem(request);
  uniSend(new SendObj(302), response);
}

function deleteItem (request, response) {
  model.deleteItem(request);
  uniSend(new SendObj(302), response);
}


// Additional functions

function wsFeddback (wss, txt) {
  wss.clients.forEach(function each(client) {
    setTimeout(function () {
      client.send(txt);
    }, 100);
  });
}


module.exports = {webView, update, addItem, deleteItem};
