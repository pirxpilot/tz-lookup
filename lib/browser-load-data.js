"use strict";

module.exports = loadData;

/*jshint browser: true */

// expect tz.bin URL defined in #tz-lookup element
function getDataUrl() {
  var el = document.getElementById('tz-lookup');
  return el && el.dataset.tzBin || el.getAttribute('data-tz-bin');
}


function fromArrayBuffer(ab) {
  var len = ab.byteLength;
  var dv = new DataView(ab);
  var uints = new Uint16Array(ab);
  var u = 0, i;

  for (i = 0; i < len; i += 2) {
    uints[u++] = dv.getUint16(i, false);
  }

  return uints;
}

function loadData(fn) {
  var url = getDataUrl();
  if (!url) {
    return fn('Missing tz.bin URL');
  }
  fetch(url, { mode: 'cors' })
    .then(function(res) {
      return res.arrayBuffer();
    })
    .then(function(ab) {
      var data = fromArrayBuffer(ab);
      fn(null, data);
    })
    .catch(fn);
}
