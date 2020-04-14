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
  uniSend(view(model.getModel(), wsport, request.headers['accept-language'].split(',')[0]), response);
}

function update (request, response, wss) {
  getFormObj(request).then(
    data => {
      model.updateItem(data.fields);
      uniSend(new SendObj(302), response);
      wsFeddback(wss, 'update');
    }
  ).catch(
    error => {
      console.log('ERROR update: '+error.message);
  });
}

function addItem (request, response, wss) {
  getFormObj(request).then(
    data => {
      model.addItem(data.fields);
      uniSend(new SendObj(302), response);
      wsFeddback(wss, 'addItem');
    }
  ).catch(
    error => {
      console.log('ERROR addItem: '+error.message);
  });
}

function deleteItem (request, response, wss) {
  getFormObj(request).then(
    data => {
      model.deleteItem(data.fields);
      uniSend(new SendObj(302), response);
      wsFeddback(wss, 'deleteItem');
    }
  ).catch(
    error => {
      console.log('ERROR deleteItem: '+error.message);
  });
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
