"use strict";

module.exports = loadData;

/*jshint browser: true */
/* global Promise */

// expect tz.bin URL defined in #tz-lookup element
function getDataUrl() {
  var el = document.getElementById('tz-lookup');
  return el && el.dataset.tzBin || el.getAttribute('data-tz-bin');
}


function fromArrayBuffer(ab) {
  return new DataView(ab);
}

function fromBlob(blob) {
  function promise(resolve) {
    var reader = new FileReader();
    reader.addEventListener("loadend", function() {
      resolve(fromArrayBuffer(reader.result));
    });
    reader.readAsArrayBuffer(blob);
  }

  return new Promise(promise);
}

function loadData(fn) {
  var url = getDataUrl();
  if (!url) {
    return fn('Missing tz.bin URL');
  }
  fetch(url, { mode: 'cors' })
    .then(function(res) {
      return res.blob();
    })
    .then(fromBlob)
    .then(function(data) {
      fn(null, data);
    })
    .catch(fn);
}
