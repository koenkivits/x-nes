all: x-nes

x-nes: lint dist
	node_modules/.bin/browserify -o dist/x-nes.js ./src/x-nes.js && node_modules/.bin/jade -o dist ./src/x-nes.jade

dist:
	mkdir -p dist

lint:
	node_modules/.bin/jshint src