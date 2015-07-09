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

fs.writeFileSync("tzid.json", JSON.stringify(list));
fs.writeFileSync("tz_world_indexed.json", JSON.stringify(data));
