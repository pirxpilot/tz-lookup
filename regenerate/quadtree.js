var COARSE_HEIGHT, COARSE_WIDTH, FINE_HEIGHT, FINE_WIDTH, data, fs, tzids;

COARSE_WIDTH  = 48;
COARSE_HEIGHT = 24;
FINE_WIDTH    = 2;
FINE_HEIGHT   = 2;

fs    = require("fs");
data  = fs.readFileSync("tz_world.pgm").slice(21);
tzids = require("./tzid.json");
