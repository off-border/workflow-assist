test: deps
	yarn test

install: build
	npm link

publish: build
	npm publish

build: deps
	yarn build

deps:
	yarn