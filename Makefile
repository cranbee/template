.PHONY: default install lib samples test perf clean patch minor

default: install lib

install:
	npm install
	npm update

lib:
	npx babel src -d lib

samples:
	node test/generator.js

test:
	node test/test.js

perf:
	rm -f prof.txt
	node --prof test/perf.js
	node --prof-process isolate-* > prof.txt
	rm isolate-*

clean:
	rm -rf lib
	rm -rf node_modules
	rm -f package-lock.json
	rm -f prof.txt

patch:
	npm version patch && npm publish --access=public

minor:
	npm version minor && npm publish --access=public
