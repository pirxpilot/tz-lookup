all: tz.bin

check:
	../node_modules/.bin/jshint pack.js

# get data

VERSION=2018d
CULTURAL_URL=http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural

timezones.geojson.zip:
	curl -L -O https://github.com/evansiroky/timezone-boundary-builder/releases/download/$(VERSION)/$@

ne_10m_urban_areas.zip:
	curl -L -O $(CULTURAL_URL)/$@

ne_10m_populated_places_simple.zip:
	curl -L -O $(CULTURAL_URL)/$@

.PRECIOUS: timezones.geojson.zip ne_10m_urban_areas.zip ne_10m_populated_places_simple.zip

dist/combined.json: timezones.geojson.zip
	unzip $< $@ && touch $@ --reference $<

tz_indexed.json: dist/combined.json
	node add_indices

# unpack tz_world_mp into a useable format. (we do this into a few tiles
# because otherwise they're too big for Node to manage :( )


tz_a.tiff: tz_indexed.json
	gdal_rasterize -a z -te -180 0 -90 90 -ts 12288 12288 -ot UInt16 $< $@

tz_b.tiff: tz_indexed.json
	gdal_rasterize -a z -te -90 0 0 90 -ts 12288 12288 -ot UInt16 $< $@

tz_c.tiff: tz_indexed.json
	gdal_rasterize -a z -te 0 0 90 90 -ts 12288 12288 -ot UInt16 $< $@

tz_d.tiff: tz_indexed.json
	gdal_rasterize -a z -te 90 0 180 90 -ts 12288 12288 -ot UInt16 $< $@

tz_e.tiff: tz_indexed.json
	gdal_rasterize -a z -te -180 -90 -90 0 -ts 12288 12288 -ot UInt16 $< $@

tz_f.tiff: tz_indexed.json
	gdal_rasterize -a z -te -90 -90 0 0 -ts 12288 12288 -ot UInt16 $< $@

tz_g.tiff: tz_indexed.json
	gdal_rasterize -a z -te 0 -90 90 0 -ts 12288 12288 -ot UInt16 $< $@

tz_h.tiff: tz_indexed.json
	gdal_rasterize -a z -te 90 -90 180 0 -ts 12288 12288 -ot UInt16 $< $@

tz_%.pgm: tz_%.tiff
	convert $< $@

TZ_FILES=a b c d e f g h
TZ_FILES_PGM=$(TZ_FILES:%=tz_%.pgm)

#rm -rf dist timezones.geojson.zip tz_a.tiff tz_b.tiff tz_c.tiff tz_d.tiff tz_e.tiff tz_f.tiff tz_g.tiff tz_h.tiff tz_indexed.json

# unpack ne_10m_urban_areas into a useable format. (we do this into a single
# file because even at large sizes bitmaps are pretty manageable.)

ne_10m_urban_areas.tiff: ne_10m_urban_areas.shp ne_10m_urban_areas.shx
	gdal_rasterize -burn 255 -te -180 -90 180 90 -ts 49152 24576 -ot Byte $< $@

%.pbm: %.tiff
	convert $< $@

# rm -rf ne_10m_urban_areas.README.html ne_10m_urban_areas.VERSION.txt ne_10m_urban_areas.dbf ne_10m_urban_areas.shp ne_10m_urban_areas.shx ne_10m_urban_areas.prj ne_10m_urban_areas.tiff ne_10m_urban_areas.zip

# and, for good measure, populated places
%.shp: %.zip
	unzip $< $@ && touch $@ --reference $<

%.shx: %.zip
	unzip $< $@ && touch $@ --reference $<

ne_10m_populated_places_simple.json: ne_10m_populated_places_simple.shp ne_10m_populated_places_simple.shx
	ogr2ogr -f GeoJSON $@ $<


#rm -rf ne_10m_populated_places_simple.README.html ne_10m_populated_places_simple.VERSION.txt ne_10m_populated_places_simple.dbf ne_10m_populated_places_simple.prj ne_10m_populated_places_simple.shp ne_10m_populated_places_simple.shx ne_10m_populated_places_simple.zip

# repack tz_world_mp and ne_10m_urban_areas into a compressed image

tz.bin: $(TZ_FILES_PGM) ne_10m_populated_places_simple.json ne_10m_urban_areas.pbm
	node pack

# -X option removes files specified in .gitignore
clean:
	git clean --force -X
