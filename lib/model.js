/*!
 * lib/model.js
 * inventura
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT
 */

const fs = require('fs');
const path = require('path');
const csvjson = require('csvjson');

function initModel () {
  let obj = {};
  let catalog;
  try {
    catalog = fs.readFileSync(path.join(path.resolve(), 'inventura_catalog.csv')).toString();
  } catch (e) {
    console.log('ERROR reading catalog file: '+e);
  }
  return convert(catalog);
}

function updateItem (request) {
  try {
    fs.copyFileSync(path.join(path.resolve(), 'inventura_catalog.csv'), path.join(path.resolve(), 'backup/inventura_bak_'+new Date()+'.csv'));
    let fields = {};
    request.url.split('?')[1].split('&').forEach( item => {
      fields[item.split('=')[0]] = item.split('=')[1];
    });
    console.log(fields);
    let obj = initModel();
    obj.filter( item => item.id == fields.id)[0].amount = fields.amount;
    obj.filter( item => item.id == fields.id)[0].valid_until = fields.valid_until;
    save(obj);
  } catch (e) {
    console.log('ERROR updating & backuping: '+e);
  }
}

function addItem (request) {
  try {
    fs.copyFileSync(path.join(path.resolve(), 'inventura_catalog.csv'), path.join(path.resolve(), 'backup/inventura_bak_'+new Date()+'.csv'));
    let fields = {};
    request.url.split('?')[1].split('&').forEach( item => {
      fields[item.split('=')[0]] = item.split('=')[1];
    });
    console.log(fields);
    let obj = initModel();
    obj.push({
      id: obj.length,
      category: fields.category,
      tags: fields.tags,
      item: fields.item,
      amount: fields.amount,
      valid_until: fields.valid_until
    });
    save(obj);
  } catch (e) {
    console.log('ERROR updating & backuping: '+e);
  }
}

// Additional functions

function convert (catalog) {
  const options = {
    delimiter : ';',
    quote     : '"'
  };
  return csvjson.toObject(catalog, options);
}

function save (obj) {
  let options = {
    delimiter   : ";",
    headers     : "key",
    wrap        : true
  }
  try {
    fs.writeFileSync(path.join(path.resolve(), 'inventura_catalog.csv'), csvjson.toCSV(obj, options));
  } catch (e) {
    console.log('ERROR saving file: '+e);
  }
  //console.log(csvjson.toCSV(obj, options));
}

module.exports = {initModel, updateItem, addItem};
