/*!
 * views/view.js
 * i-n-v-e-n-t-u-r-a (https://github.com/dstegen/i-n-v-e-n-t-u-r-a)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/i-n-v-e-n-t-u-r-a/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const fs = require('fs');
const {SendObj} = require('webapputils-ds');
const locale = require('./locale.json');


function view (obj, wsport, lang='en') {
  let categories = Array.from(new Set(obj.filter( item => item.category !== '').map( item => { return item.category})));
  let tags = Array.from(new Set(obj.filter( item => item.tags !== '').map( item => { return item.tags}).toString().split(',')));
  let sendObj = new SendObj();
  sendObj.data = `
    <!DOCTYPE HTML>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=yes">
        <title>i-n-v-e-n-t-u-r-a</title>
        <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="/node_modules/tokenfield/dist/tokenfield.css">
        <link rel="stylesheet" href="/public/styles.css">
      </head>
      <body>
        <div class="container pt-3 pb-5">
          <small>Stegens</small>
          <h1>i-n-v-e-n-t-u-r-a</h1>
          <div id="filterButtons" class="d-flex justify-content-start py-3">
            <button class="mr-3 mb-2" onclick="showAll()">all</button>
            ${categories.map(makeFilterButtons).join('')}
            ${tags.map(makeFilterButtons).join('')}
          </div>
          <form id="searchItem" class="mb-3">
            <input type="text" id="searchterm" name="searchterm" placeholder="${locale.searchterm[lang]}" value="" /> &nbsp;
            <span class="text-success">&#9632; ${locale.ok2weeks[lang]}</span> &nbsp;
            <span class="text-warning">&#9632; ${locale.ok1week[lang]}</span> &nbsp;
            <span class="text-danger">&#9632; ${locale.expired[lang]}</span> &nbsp;
            <span class="text-out">&#9632; ${locale.notinstock[lang]}</span>
          </form>
          <table id="myTable" class="table-responsive">
            <tr style="font-weight: bold; text-align: center;">
              <th>
                ${Object.keys(obj[0]).map( (item,i) => { return '<span onclick="sortTable('+i+')">'+locale[item][lang]+' &#8645;</span>';}).join('</th><th>') }
              </th>
              <td>
                - / +
              </td>
              <td>
                ${locale.edit[lang]}
              </td>
            </tr>
            ${obj.map(makeRow).join('')}
          </table>
          <div id="tableFooter" class="d-flex justify-content-between mt-3">
            <span class="align-self-center">${locale.lastUpdated[lang]} ${fs.statSync('./inventura_catalog.csv')['mtime'].toString().substring(0,21)}</span>
            <!-- Button trigger modal -->
            <button type="button" class="btn-sm btn-primary align-self-center" data-toggle="modal" data-target="#addModal">
              ${locale.additem[lang]}
            </button>
          </div>
        </div>
        <!-- Edit Modal -->
        <div id="editModal" class="modal" tabindex="-1" role="dialog">
          <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">  </h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form id="editForm" action="/update" method="post" class="form-inline d-flex justify-content-between">
                  <div class="d-flex justify-content-start row align-items-center">
                    <input type="text" readonly class="d-none" id="id" name="id" value="" />
                    <lable for="amount">${locale.amount[lang]}: </lable>
                    <input type="texte" class="form-control-sm mx-1" id="amount" name="amount" style="width: 2rem;" value="" required />
                    <lable for="valid_until">${locale['valid_until'][lang]}: </lable>
                    <input type="date" class="form-control-sm mx-1" id="valid_until" name="valid_until" value="" />
                    <lable for="tags">${locale.tags[lang]}: </lable>
                    <input type="texte" class="form-control-sm mx-1 tagsfield" id="tags" name="tags" value="${tags}" disabled/>
                  </div>
                  <input type="submit" class="btn btn-primary" value="${locale.savechanges[lang]}" />
                </form>
              </div>
              <div class="modal-footer d-flex justify-content-between">
                <form id="deleteForm" action="/deleteitem" method="post">
                  <input type="text" readonly class="d-none" id="del_id" name="del_id" value="" />
                  <input type="submit" class="btn btn-danger" value="${locale.deleteItem[lang]}" />
                </form>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">${locale.cancle[lang]}</button>
              </div>
            </div>
          </div>
        </div>
        <!-- Edit Modal End -->
        <!-- Add Modal -->
        <div class="modal fade" id="addModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title" id="exampleModalLabel">${locale.additem[lang]}</h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form id="addItem" action="/additem" method="post">
                  <div class="form-group row">
                    <lable class="col-2" for="item">${locale.item[lang]}: </lable>
                    <div class="col-10 pl-0">
                      <input type="text" class="form-control-sm" id="add_item" name="item" value="" required />
                      <lable for="amount">${locale.amount[lang]}: </lable>
                      <input type="texte" class="form-control-sm mx-1" id="add_amount" name="amount" style="width: 2rem;" value="" required />
                      <lable for="valid_until">${locale['valid_until'][lang]}: </lable>
                      <input type="date" class="form-control-sm mx-1" id="add_valid_until" name="valid_until" value="" />
                    </div>
                  </div>
                    <div class="form-group row mt-3 mr-3">
                      <label class="col-2" for="category">${locale.category[lang]}</label>
                      <select class="col-4 form-control-sm" id="add_category" name="category" require>
                        ${categories.map(getoptions).join('')}
                      </select>
                      <input type="text" class="offset-1 col-5 form-control-sm tagsfield" id="add_tags" name="tags" value="" placeholder="${locale.tags[lang]}" />
                    </div>
                    <div class="d-flex justify-content-center">
                      <input type="submit" class="btn btn-primary" value="${locale.add[lang]}" />
                    </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">${locale.cancle[lang]}</button>
              </div>
            </div>
          </div>
        </div>
        <!-- Add Modal End -->
        <footer class="container text-center small py-3 border-top">
          &copy; 2020 by Daniel Stegen
        </footer>
        <script src="/node_modules/jquery/dist/jquery.min.js"></script>
        <script src="/node_modules/tokenfield/dist/tokenfield.min.js"></script>
        <script src="/node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
        <script src="/public/cookie.js"></script>
        <script>
          let categories = [${categories.map(item => {return '"'+item+'"'})}];
          let myTags = [${tags.map(item => { return '{ "id": "'+item+'", "name": "'+item+'"}' })}];
        </script>
        <script src="/public/scripts.js"></script>
        <script>
          // Websockets
          const hostname = window.location.hostname ;
          const socket = new WebSocket('ws://'+hostname+':${wsport}/');
          socket.onmessage = function (msg) {
            location.reload();
            console.log(msg.data);
          };
        </script>
      </body>
    </html>
  `;
  return sendObj;
}


// Additional functions

function makeRow (item) {
  let now = new Date().toISOString().substr(0,10);
  let now7 = new Date(Date.now() + 6048e5).toISOString().substr(0,10);
  let now14 = new Date(Date.now() + 12096e5).toISOString().substr(0,10);
  let rowColor = 'bg-light';
  if (item.valid_until < now14) rowColor = 'bg-success';
  if (item.valid_until < now7) rowColor = 'bg-warning';
  if (item.valid_until < now) rowColor = 'bg-danger';
  if (item.amount < 1) rowColor = 'bg-out';
  let returnRow = `<tr id="${item.id}" class="${item.category} ${rowColor} ${item.tags.split(',').join(' ')}">`;
  Object.keys(item).forEach((key, i) => {
    returnRow += `
      <td class="entries id${item.id} ${key}">${item[key]}</td>
    `;
  });
  returnRow += `<td><button type="button" class="btn-sm btn-primary" onclick="reduceItem(${item.id})">&nbsp;-&nbsp;</button> | <button type="button" class="btn-sm btn-primary" onclick="increaseItem(${item.id})">&nbsp;+&nbsp;</button></td>`;
  returnRow += `<td><button onclick="editItem(${item.id})">edit</button></td>`;
  returnRow += `</tr>`;
  return returnRow;
}

function makeFilterButtons (item) {
  return `<button class="mr-3 mb-2" onclick="hideOthers('${item}')">${item}</button>`;
}

function getoptions (item) {
  return `<option>${item}</option>`
}


module.exports = view;
