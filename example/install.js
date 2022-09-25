/*!
 * example/install.js
 * i-n-v-e-n-t-u-r-a (https://github.com/dstegen/i-n-v-e-n-t-u-r-a)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/i-n-v-e-n-t-u-r-a/blob/master/LICENSE)
 */

const fs = require('fs');
const path = require('path');


try {
  if (!fs.existsSync(path.join(path.resolve(), 'inventura_catalog.csv'))) {
    console.log('\nInstalling example file...');
    fs.copyFileSync(path.join(path.resolve(), 'example/inventura_catalog.csv'), path.join(path.resolve(), 'inventura_catalog.csv'));
  }
} catch (e) {
  console.log('ERROR instaling example file: '+e);
}

try {
  if (!fs.existsSync(path.join(path.resolve(), 'backup'))) {
    console.log('\nCreating backup directory...');
    fs.mkdirSync(path.join(path.resolve(), 'backup'));
  }
} catch (e) {
  console.log('ERROR creating backup directory: '+e);
}

console.log('\nFinished installing i-n-v-e-n-t-u-r-a!');
console.log('Start the application with "npm start" or node index.js\n');
