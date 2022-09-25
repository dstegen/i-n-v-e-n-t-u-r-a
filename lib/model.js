/*!
 * lib/model.js
 * i-n-v-e-n-t-u-r-a (https://github.com/dstegen/i-n-v-e-n-t-u-r-a)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/i-n-v-e-n-t-u-r-a/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const fs = require('fs');
const path = require('path');
const csvjson = require('csvjson');

function getModel () {
  let catalog = [];
  try {
    catalog = fs.readFileSync(path.join(path.resolve(), 'inventura_catalog.csv')).toString();
  } catch (e) {
    console.log('ERROR reading catalog file: '+e);
  }
  return convert(catalog);
}

function updateItem (fields) {
  try {
    console.log(fields);
    let tagArray = [];
    Object.keys(fields).filter(item => item.startsWith('tags')).forEach( key => {
      if (fields[key] != '') tagArray.push(fields[key]);
    });
    let obj = getModel();
    obj.filter( item => item.id == fields.id)[0].amount = fields.amount;
    obj.filter( item => item.id == fields.id)[0].valid_until = fields.valid_until;
    obj.filter( item => item.id == fields.id)[0].tags = tagArray.toString();
    save(obj);
  } catch (e) {
    console.log('ERROR updating & backuping: '+e);
  }
}

function addItem (fields) {
  try {
    console.log(fields);
    let tagArray = [];
    Object.keys(fields).filter(item => item.startsWith('tags')).forEach( key => {
      if (fields[key] != '') tagArray.push(fields[key]);
    });
    let obj = getModel();
    obj.push({
      id: Math.max(...obj.map( item => item.id)) + 1,
      category: fields.category,
      tags: tagArray.toString(),
      item: decodeURIComponent(fields.item).replace(/\+/g,' '),
      amount: fields.amount,
      valid_until: fields.valid_until
    });
    save(obj);
  } catch (e) {
    console.log('ERROR updating & backuping: '+e);
  }
}

function deleteItem (fields) {
  try {
    console.log(fields);
    let obj = getModel().filter( item => item.id != fields.del_id);
    save(obj);
  } catch (e) {
    console.log('ERROR deleting item: '+e);
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
    // backup first
    if (!fs.existsSync(path.join(path.resolve(), 'backup'))) {
      fs.mkdirSync(path.join(path.resolve(), 'backup'));
    }
    fs.copyFileSync(path.join(path.resolve(), 'inventura_catalog.csv'), path.join(path.resolve(), 'backup/inventura_bak_'+new Date()+'.csv'));
    // save new file
    fs.writeFileSync(path.join(path.resolve(), 'inventura_catalog.csv'), csvjson.toCSV(obj, options));
  } catch (e) {
    console.log('ERROR backuping/saving file: '+e);
  }
}


module.exports = {getModel, updateItem, addItem, deleteItem};
