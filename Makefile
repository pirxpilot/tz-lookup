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
		--alias:node:test=mocha \
		--alias:node:assert=assert \
		--external:mocha \
		--sourcemap \
		--outfile=$@

# $(NODE_BIN)/browserify --entry ./test.js --outfile $@

.DELETE_ON_ERROR: build/build.js

node_modules: package.json
	yarn --cwd $(@D) --no-progress --frozen-lockfile --silent
	touch $@

lint: | node_modules
	$(NODE_BIN)/jshint $(SRC) test.js

test: | node_modules
	node --test test.js

clean:
	rm -fr build node_modules

.PHONY: clean lint check all compile test
