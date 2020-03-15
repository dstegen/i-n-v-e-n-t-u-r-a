/*!
 * lib/deliver.js
 * inventura
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT
 */


// Required Moduls
const fs = require('fs');
const path = require('path');
const mimetype = require('mimetype');


function deliver (request) {
  let procDir = path.join(__dirname, '../');
  let sendObj = {
    statusCode: 200,
    contentType: mimetype.lookup(request.url.substr(1)),
    cookie: [],
    location: '/',
    data: ''
  };
  sendObj = getMyFile(sendObj, path.join(procDir, request.url));
  return sendObj;
}

// Additional function
function getMyFile (sendObjLocal, pathLocal) {
  try {
    sendObjLocal.data = fs.readFileSync(pathLocal.split('?')[0]);
  } catch (e) {
    sendObjLocal.statusCode = 404;
    sendObjLocal.data = null;
  }
  return sendObjLocal;
}

module.exports = deliver;
