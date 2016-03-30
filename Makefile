all: x-nes.html

x-nes.html: x-nes.js dist
	node_modules/.bin/jade -o dist ./src/x-nes.jade

x-nes.js: lint dist
	node_modules/.bin/browserify ./src/x-nes.js | node_modules/.bin/uglifyjs -c -o dist/x-nes.js

dist:
	mkdir -p dist

lint:
	node_modules/.bin/jshint src