PROJECT=tz-lookup
NODE_BIN=./node_modules/.bin
SRC = index.js $(wildcard lib/*.js)

all: check compile

check: lint test

compile: build/build.js

build:
	mkdir -p $@

build/build.js: node_modules $(SRC) | build
	$(NODE_BIN)/esbuild \
		--bundle ./test.js \
		--define:DEBUG=true \
		--define:process.env.NODE_DEBUG='"tz-lookup"' \
		--alias:assert=./node_modules/assert \
		--sourcemap \
		--outfile=$@

# $(NODE_BIN)/browserify --entry ./test.js --outfile $@

.DELETE_ON_ERROR: build/build.js

node_modules: package.json
	yarn && touch $@

lint: | node_modules
	$(NODE_BIN)/jshint $(SRC) test.js

test: | node_modules
	$(NODE_BIN)/mocha --reporter dot test.js

clean:
	rm -fr build node_modules

.PHONY: clean lint check all compile test
