#!/bin/sh
TZ_WORLD_URI="http://efele.net/maps/tz/world/tz_world.zip"
curl "$TZ_WORLD_URI" -o tz_world.zip
unzip tz_world.zip
ogr2ogr -f GeoJSON tz_world.json world/tz_world.shp
node index
gdal_rasterize -a INDEX -l OGRGeoJSON -ts 24576 12288 -ot UInt16 \
  tz_world_indexed.json tz_world.tiff
convert tz_world.tiff tz_world.pgm
node quadtree
rm -rf tz_world.zip world tz_world.json tz_world_indexed.json tz_world.tiff \
  tz_world.pgm
