/*!
 * lib/router.js
 * i-n-v-e-n-t-u-r-a (https://github.com/dstegen/i-n-v-e-n-t-u-r-a)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/i-n-v-e-n-t-u-r-a/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const execSync = require('child_process').execSync;
const {deliver} = require('webapputils-ds');
const {webView, update, addItem, deleteItem} = require('./controller');


function router (request, response, wss, wsport) {
  let route = request.url.substr(1).split('?')[0];
  if (request.url.includes('media') || request.url.includes('node_modules') || request.url.includes('public') || request.url.includes('favicon')) route = 'static';
  switch (route) {
    case 'static':
      deliver(request, response);
      break;
    case 'update':
      update(request, response, wss);
      break;
    case 'additem':
      addItem(request, response, wss);
      break;
    case 'deleteitem':
      deleteItem(request, response, wss);
      break;
    case 'poweroff':
      execSync('sudo poweroff');
      break;
    case 'reboot':
      execSync('sudo reboot');
      break;
    default:
      webView(request, response, wss, wsport)
  }
}

module.exports = router;
