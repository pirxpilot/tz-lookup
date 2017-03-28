"use strict";

var fs = require("fs");
var path = require("path");

function fromBuffer(buffer) {
  var len = buffer.length;
  var ab = new ArrayBuffer(len);

  var view = new Uint8Array(ab);

  for (var i = 0; i < len; ++i) {
    view[i] = buffer[i];
  }
  return new DataView(ab);
}

function fromFile(fn) {
  var filename = path.join(__dirname, '../tz.bin');
  var buffer = fs.readFile(filename, function(err, buffer) {
    if (err) { return fn(err) }
    fn(null, fromBuffer(buffer));
  });
}

module.exports = fromFile;
