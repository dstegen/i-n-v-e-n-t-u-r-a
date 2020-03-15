/*!
 * public/scripts.js
 * inventura
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT
 */

let editObj = {};

function editItem (id) {
  editObj.id = id;
  editObj.item = $('.id'+id+'.item')[0].innerText;
  editObj.amount = $('.id'+id+'.amount')[0].innerText;
  editObj.valid = $('.id'+id+'.valid_until')[0].innerText;
  $('#id').val(editObj.id);
  $('.modal-title')[0].innerText = editObj.item;
  $('#amount').val(editObj.amount);
  $('#valid_until').val(editObj.valid);
  $('#editModal').modal('toggle');
}

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

function sortTable(column) {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("myTable");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[column];
      y = rows[i + 1].getElementsByTagName("TD")[column];
      //check if the two rows should switch place:
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}
