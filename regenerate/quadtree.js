var COARSE_HEIGHT, COARSE_WIDTH, FINE_HEIGHT, FINE_WIDTH, PIXEL_HEIGHT,
    PIXEL_WIDTH, LOSSY_THRESHOLD, data, fs, pack, pixel, quadtree, tzids;

/* The coarse dimensions *must* be a multiple of 48x1, in order to efficiently
 * accomodate the oceanic zones, and *should* be a multiple of 2x1, in order to
 * keep the quadtree nodes square. 48x24 is the smallest such multiple. */
COARSE_WIDTH    = 48;
COARSE_HEIGHT   = 24;
FINE_WIDTH      = 2;
FINE_HEIGHT     = 2;
PIXEL_WIDTH     = 24576;
PIXEL_HEIGHT    = 12288;
LOSSY_THRESHOLD = 0.9375;

fs    = require("fs");
data  = fs.readFileSync("tz_world.pgm").slice(21);
tzids = require("./tzid.json");

pixel = function(x, y) {
  return (x >= 0 && x < PIXEL_WIDTH && y >= 0 && y < PIXEL_HEIGHT) ?
    data.readUInt16BE((PIXEL_WIDTH * y + x) << 1) - 1 :
    -1;
};

quadtree = function(x, y, width, height, cols, rows) {
  var h, histogram, i, j, list, node, tzid, w;

  histogram = new Uint32Array(tzids.length);
  for(j = 0; j < height; j++) {
    for(i = 0; i < width; i++) {
      tzid = pixel(x + i, y + j);

      if(~tzid) {
        histogram[tzid]++;
      }
    }
  }

  list = [];
  for(i = 0; i < tzids.length; i++) {
    if(histogram[i] > 0) {
      list.push(i);
    }
  }
  list.sort(function(a, b) {
    return histogram[b] - histogram[a];
  });
  if(list.length === 0) {
    return tzids.length + Math.round(24.0 * (x + 0.5 * width) / PIXEL_WIDTH);
  }
  if(list.length === 1) {
    return list[0];
  }
  if(histogram[list[0]] >= width * height * LOSSY_THRESHOLD) {
    return list[0];
  }

  node = new Array(cols * rows);
  w = width  / cols;
  h = height / rows;
  for(j = 0; j < rows; j++) {
    for(i = 0; i < cols; i++) {
      node[j * cols + i] = quadtree(
        x + w * i,
        y + h * j,
        w,
        h,
        FINE_WIDTH,
        FINE_HEIGHT
      );
    }
  }
  return node;
};

pack = function(root) {
  var hash, list, recurse;

  hash = {};
  list = tzids.concat([
    "Etc/GMT+12", "Etc/GMT+11", "Etc/GMT+10", "Etc/GMT+9",  "Etc/GMT+8",
    "Etc/GMT+7",  "Etc/GMT+6",  "Etc/GMT+5",  "Etc/GMT+4",  "Etc/GMT+3",
    "Etc/GMT+2",  "Etc/GMT+1",  "Etc/GMT",    "Etc/GMT-1",  "Etc/GMT-2",
    "Etc/GMT-3",  "Etc/GMT-4",  "Etc/GMT-5",  "Etc/GMT-6",  "Etc/GMT-7",
    "Etc/GMT-8",  "Etc/GMT-9",  "Etc/GMT-10", "Etc/GMT-11", "Etc/GMT-12"
  ]);

  recurse = function(node) {
    var i, key;

    if(typeof node === "number") {
      return node;
    }

    if(Array.isArray(node)) {
      node = node.slice(0);
      for(i = 0; i < node.length; i++) {
        node[i] = recurse(node[i]);
      }
      key = node.join(" ");
      if(!hash.hasOwnProperty(key)) {
        hash[key] = list.length;
        list.push(node);
      }
      return hash[key];
    }

    throw new Error("bad node type");
  };

  return {index: list, root: recurse(root)};
};

console.log(
  "%d",
  pack(
    quadtree(0, 0, PIXEL_WIDTH, PIXEL_HEIGHT, COARSE_WIDTH, COARSE_HEIGHT)
  ).root
);
