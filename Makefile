.PHONY: lib samples test patch minor clean

lib:
	npx babel src -d lib

samples:
	node test/generator.js

test:
	node test/test.js

patch:
	npm version patch && npm publish --access=public

minor:
	npm version minor && npm publish --access=public

clean:
	rm -rf lib
