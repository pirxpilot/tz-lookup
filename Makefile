PROJECT=tz-lookup
NODE_BIN=./node_modules/.bin
SRC = index.js $(wildcard lib/*.js)

all: check compile

check: lint test

compile: build/build.js

build:
	mkdir -p $@

build/build.js: $(SRC) | build
	$(NODE_BIN)/esbuild \
		--bundle ./test.js \
		--define:DEBUG=true \
		--define:process.env.NODE_DEBUG='"tz-lookup"' \
		--alias:node:test=mocha \
		--alias:node:assert=assert \
		--external:mocha \
		--sourcemap \
		--outfile=$@

.DELETE_ON_ERROR: build/build.js

lint:
	$(NODE_BIN)/biome ci

format:
	$(NODE_BIN)/biome check --fix

test:
	node --test test.js

clean:
	rm -fr build

.PHONY: clean format lint check all compile test
