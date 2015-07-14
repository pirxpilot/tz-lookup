"use strict";
var COARSE_HEIGHT, COARSE_WIDTH, FINE_HEIGHT, FINE_WIDTH, LOSSY_THRESHOLD,
    MAX_NODES, PIXEL_HEIGHT, PIXEL_WIDTH, data, fs, pack, pixel, quadtree,
    tzids;

fs    = require("fs");
data  = fs.readFileSync("tz_world.pgm").slice(21);
tzids = require("../zones.json").length;

/* The coarse dimensions *must* be a multiple of 48x1, in order to efficiently
 * accomodate the oceanic zones, and *should* be a multiple of 2x1, in order to
 * keep the quadtree nodes square. 48x24 is the smallest such multiple. */
COARSE_WIDTH    = 48;
COARSE_HEIGHT   = 24;
FINE_WIDTH      = 2;
FINE_HEIGHT     = 2;
PIXEL_WIDTH     = 24576;
PIXEL_HEIGHT    = 12288;
LOSSY_THRESHOLD = 15.0 / 16.0;
MAX_NODES       = 0x10000 - tzids;

pixel = function(x, y) {
  return (x >= 0 && x < PIXEL_WIDTH && y >= 0 && y < PIXEL_HEIGHT) ?
    data.readUInt16BE((PIXEL_WIDTH * y + x) << 1) - 1 :
    -1;
};

quadtree = function(x, y, width, height, cols, rows) {
  var h, histogram, i, j, list, node, total, tzid, w;

  /* Generate a histogram of which timezones are covered in this area. */
  histogram = new Uint32Array(tzids);
  total     = 0;

  for(j = 0; j < height; j++) {
    for(i = 0; i < width; i++) {
      tzid = pixel(x + i, y + j);

      if(~tzid) {
        histogram[tzid]++;
        total++;
      }
    }
  }

  /* Build a list of timezones covered, and the count of pixels covered. */
  list  = [];

  for(i = 0; i < tzids; i++) {
    if(histogram[i]) {
      list.push(i);
    }
  }

  /* If this region doesn't contain any timezones, use an international
   * timezone. */
  if(list.length === 0) {
    /* The last 25 slots of the TZID array are for international timezones,
     * from west to east. */
    return tzids - 25 + Math.round(24.0 * (x + 0.5 * width) / PIXEL_WIDTH);
  }

  /* If this region only has a single timezone, use it. */
  if(list.length === 1) {
    return list[0];
  }

  /* Sort the list of timezones covered in descending order. */
  list.sort(function(a, b) {
    return histogram[b] - histogram[a];
  });

  if(histogram[list[0]] < histogram[list[1]]) {
    throw new Error("oops, I sorted wrong");
  }

  /* If the largest timezone in this region covers an overwhelming majority of
   * the pixels, then just use it. */
  if(histogram[list[0]] >= total * LOSSY_THRESHOLD) {
    return list[0];
  }

  /* Otherwise, recurse down. */
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

pack = (function() {
  var binary, flatten, recurse;

  /* `recurse()` returns a number; the low 26 bits represent a position for a
   * given tree depth, and the 6 bits above that represent the depth from the
   * bottom of the tree. We want to pack higher nodes before lower nodes, such
   * that every node's position in the packed array is before it's children;
   * this is why we break it down this way instead of doing a straight DFS or
   * BFS. */
  recurse = function(node, index) {
    var depth, i, j, list, t;

    /* Numerical leaves are already indexed; note that the high 6 bits are
     * always going to be zero. The mask is thus extraneous, though be advised
     * if we ever have more than 2^26 timezones, this will break. (Also, if we
     * ever have more than 2^26 timezones, I will never ever touch a computer
     * ever again, it's just not worth it.) */
    if(!Array.isArray(node)) {
      return node & 0x3ffffff;
    }

    /* Otherwise, we're a central node. Canonicalize it by processing each of
     * it's children... */
    node = node.slice(0);
    for(i = 0; i < node.length; i++) {
      node[i] = recurse(node[i], index);
    }

    /* Determine this node's depth: it should be one greater than any of it's
     * children's depths. */
    depth = 0;
    for(i = 0; i < node.length; i++) {
      t = node[i] >> 26;
      if(t > depth) {
        depth = t;
      }
    }
    ++depth;

    /* If the index does not contain this depth, the index is stupid and must
     * be fixed. */
    while(index.length < depth) {
      index.push([]);
    }
    list = index[depth - 1];

    /* Find the position of this node within the index. */
    outer: for(i = list.length; i--; ) {
      for(j = node.length; j--; ) {
        if(node[j] !== list[i][j]) {
          continue outer;
        }
      }

      break;
    }
    if(!~i) {
      list.push(node);
      i = list.length - 1;
    }
    return (depth << 26) | (i & 0x3ffffff);
  };

  flatten = function(index) {
    var i, j, k, l, list, node, nodes, offset, t;

    /* Compute index offsets for each depth. */
    offset = new Array(index.length + 1);
    offset[offset.length - 1] = 0;
    for(i = offset.length - 1; i--; ) {
      offset[i] = offset[i + 1] + index[i].length;
    }

    /* Flatten the index into a list. */
    list = new Array(offset[0]);
    i    = 0;
    for(j = index.length; j--; ) {
      nodes = index[j];
      for(k = 0; k < nodes.length; k++) {
        node = nodes[k];
        for(l = node.length; l--; ) {
          t = node[l];

          if(t & 0xfc000000) {
            t = offset[t >> 26] + (t & 0x3ffffff) - i;
            if(t >= MAX_NODES) {
              throw new Error("node offset too great");
            }
          }

          else {
            t = MAX_NODES + t;
            if(t >= 0x10000) {
              throw new Error("oops, I can't add");
            }
          }

          node[l] = t;
        }

        list[i++] = node;
      }
    }

    return list;
  };

  binary = function(nodes) {
    var buffer, i, j, node, offset;

    buffer = new Buffer(
      1 * COARSE_WIDTH * COARSE_HEIGHT * 2 +
      (nodes.length - 1) * FINE_WIDTH * FINE_HEIGHT * 2
    );
    offset = 0;

    for(i = 0; i < nodes.length; i++) {
      node = nodes[i];

      for(j = 0; j < node.length; j++) {
        buffer.writeUInt16BE(node[j], offset);
        offset += 2;
      }
    }

    if(offset !== buffer.length) {
      console.log(offset, buffer.length);
      throw new Error("oops, allocated the wrong buffer length");
    }

    return buffer;
  };

  return function(root) {
    var index;

    index = [];
    recurse(root, index);
    return binary(flatten(index));
  };
})();

fs.writeFileSync(
  "../tz.bin",
  pack(
    quadtree(
      0,
      0,
      PIXEL_WIDTH,
      PIXEL_HEIGHT,
      COARSE_WIDTH,
      COARSE_HEIGHT
    )
  )
);
