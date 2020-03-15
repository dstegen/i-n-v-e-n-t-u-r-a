/*!
 * public/scripts.js
 * i-n-v-e-n-t-u-r-a (https://github.com/dstegen/i-n-v-e-n-t-u-r-a)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/i-n-v-e-n-t-u-r-a/blob/master/LICENSE)
 */


// editing items

let editObj = {};

function editItem (id) {
  editObj.id = id;
  editObj.item = $('.id'+id+'.item')[0].innerText;
  editObj.amount = $('.id'+id+'.amount')[0].innerText;
  editObj.valid = $('.id'+id+'.valid_until')[0].innerText;
  editObj.tags = $('.id'+id+'.tags')[0].innerText;
  $('#id').val(editObj.id);
  $('.modal-title')[0].innerText = editObj.item;
  $('#amount').val(editObj.amount);
  $('#valid_until').val(editObj.valid);
  $('#tags').val(editObj.tags);
  $('#editModal').modal('toggle');
}


// filters

function hideOthers (cat) {
  categories.forEach( item => {
    $('.'+item).hide();
  });
  $('.'+cat).show();
}

function showAll () {
  categories.forEach( item => {
    $('.'+item).show();
  });
}


// full text search in items

$(document).on('submit','form#searchItem',function(e){
  findMe($('#searchterm').val());
  e.preventDefault();
});

function findMe (text) {
  categories.forEach( item => {
    $('.'+item).hide();
  });
  Object.keys($('.item')).forEach( key => {
    if ($('.item')[key].innerText && $('.item')[key].innerText.toLowerCase().includes(text.toLowerCase())) {
      $('#'+$('.item')[key].parentElement.id).show();
    }
  });
}


// table sorting

let colums = $('#myTable')[0].rows[0].childElementCount-1;
let directionList = [];
for (let i=0; i<colums; i++) {
  directionList.push('asc');
};

function sortTable(column) {
  let direction = directionList[column];
  if (direction === 'asc') {
    directionList[column] = 'des';
  } else {
    directionList[column] = 'asc';
  }
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("myTable");
  switching = true;
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[column];
      y = rows[i + 1].getElementsByTagName("TD")[column];
      if (direction == 'des') {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}
