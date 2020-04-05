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
  let tagsArray = [];
  editObj.tags.split(',').forEach( item => {
    if (item != '') {
      tagsArray.push({ id: item, name: item });
    }
  });
  $('#id').val(editObj.id);
  $('.modal-title')[0].innerText = editObj.item;
  $('#amount').val(editObj.amount);
  $('#valid_until').val(editObj.valid);
  $('#tags').val(editObj.tags);
  tf.setItems(tagsArray);
  $('#editModal').modal('toggle');
}

function reduceItem (id) {
  let newAmount = parseInt($('td.entries.id'+id+'.amount').text()) - 1;
  $('td.entries.id'+id+'.amount').text(newAmount);
  ajaxUpdater({'id': id, 'amount': newAmount, 'valid_until': $('.id'+id+'.valid_until')[0].innerText, 'tags': $('.id'+id+'.tags')[0].innerText});
}

function increaseItem (id) {
  let newAmount = parseInt($('td.entries.id'+id+'.amount').text()) + 1;
  $('td.entries.id'+id+'.amount').text(newAmount);
  ajaxUpdater({'id': id, 'amount': newAmount, 'valid_until': $('.id'+id+'.valid_until')[0].innerText, 'tags': $('.id'+id+'.tags')[0].innerText});
}

function ajaxUpdater (dataIn) {
  $.ajax({
    url: '/update', // url where to submit the request
    type : 'GET', // type of action POST || GET
    dataType : 'json', // data type
    data : dataIn, // post data || get data
    success : function(result) {
        // you can see the result from the console
        // tab of the developer tools
        console.log(result);
        location.reload();
    }
  });
}

// filters

function hideOthers (cat) {
  if (cat !== '' && cat !== undefined) {
    Cookies.set('lastFilter', cat);
    categories.forEach( item => {
      $('.'+item).hide();
    });
    $('.'+cat).show();
  }
  $('#tableFooter').width($('TBODY').width());
}

function showAll () {
  Cookies.remove('lastFilter');
  categories.forEach( item => {
    $('.'+item).show();
  });
  $('#tableFooter').width($('TBODY').width());
}

hideOthers(Cookies.get('lastFilter'));

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

// tokenfield

const tf = new Tokenfield({
  el: document.querySelector('#tags'), // Attach Tokenfield to the input element with class "text-input"
  items: myTags,
  delimiters: [','],
  itemName: "tags",
  newItemName: "tags"
});

const tf2 = new Tokenfield({
  el: document.querySelector('#add_tags'), // Attach Tokenfield to the input element with class "text-input"
  items: myTags,
  delimiters: [','],
  itemName: "tags",
  newItemName: "tags"
});

// Resize Table Footer

$('#tableFooter').width($('TBODY').width());
