module.exports = loadData;

/*jshint browser: true */

// expect tz.bin URL defined in #tz-lookup element
function getDataUrl() {
  const el = document.getElementById('tz-lookup');
  return el?.dataset.tzBin;
}


function fromArrayBuffer(ab) {
  const len = ab.byteLength;
  const dv = new DataView(ab);
  const uints = new Uint16Array(ab);
  let u = 0;

  for (let i = 0; i < len; i += 2) {
    uints[u++] = dv.getUint16(i, false);
  }

  return uints;
}

function loadData() {
  const url = getDataUrl();
  if (!url) {
    throw(new Error('Missing tz.bin URL'));
  }
  return fetch(url, { mode: 'cors' })
    .then(res => res.arrayBuffer())
    .then(ab => fromArrayBuffer(ab));
}
