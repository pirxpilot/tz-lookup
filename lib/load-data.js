"use strict";

var fs = require("fs");
var path = require("path");

function fromBuffer(buffer) {
  var len = buffer.length;
  var ab = new ArrayBuffer(len);
  var u = 0, i;

  var uints = new Uint16Array(ab);
  for (i = 0; i < len; i += 2) {
    uints[u++] = buffer.readUInt16BE(i, false);
  }
  return uints;
}

function fromFile(fn) {
  var filename = path.join(__dirname, '../data/tz.bin');
  fs.readFile(filename, function(err, buffer) {
    if (err) { return fn(err); }
    fn(null, fromBuffer(buffer));
  });
}

module.exports = fromFile;
