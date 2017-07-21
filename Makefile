.PHONY: lib samples test perf patch minor clean

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

patch:
	npm version patch && npm publish --access=public

minor:
	npm version minor && npm publish --access=public

clean:
	rm -rf lib
	rm -f prof.txt
