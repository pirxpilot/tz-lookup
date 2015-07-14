"use strict";
var data, feature, features, fs, hash, i, list, tzid;

fs = require("fs");

data = require("./tz_world.json");
list = [];
hash = {};

delete data["crs"];

features = data["features"];

for(i = 0; i < features.length; i++) {
  feature = features[i];
  tzid    = feature["properties"]["TZID"];

  if(tzid === "uninhabited" || tzid === "unknown") {
    features.splice(i--, 1);
    continue;
  }

  if(!hash.hasOwnProperty(tzid)) {
    list.push(tzid);
    hash[tzid] = list.length;
  }

  feature["properties"]["INDEX"] = hash[tzid];
}

list.push(
  "Etc/GMT+12", "Etc/GMT+11", "Etc/GMT+10", "Etc/GMT+9",  "Etc/GMT+8",
  "Etc/GMT+7",  "Etc/GMT+6",  "Etc/GMT+5",  "Etc/GMT+4",  "Etc/GMT+3",
  "Etc/GMT+2",  "Etc/GMT+1",  "Etc/GMT",    "Etc/GMT-1",  "Etc/GMT-2",
  "Etc/GMT-3",  "Etc/GMT-4",  "Etc/GMT-5",  "Etc/GMT-6",  "Etc/GMT-7",
  "Etc/GMT-8",  "Etc/GMT-9",  "Etc/GMT-10", "Etc/GMT-11", "Etc/GMT-12"
);

fs.writeFileSync("../zones.json", JSON.stringify(list));
fs.writeFileSync("tz_world_indexed.json", JSON.stringify(data));
