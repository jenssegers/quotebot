PWD = $(shell pwd)
SERVER = sandy.wetteren.jenssegers.com
TARGET = /var/www/jenssegers/quotebot2
REGISTRY = registry.jenssegers.com

install: node_modules
	touch .env

node_modules: package.json
	docker run --rm --init \
    	-v $(PWD):/code \
    	-w /code \
    	node:10 npm install

clean:
	rm -rf node_modules
	rm -rf .next

build:
	docker build --pull -f ./docker/Dockerfile -t $(REGISTRY)/jenssegers/quotebot .

push:
	docker push $(REGISTRY)/jenssegers/quotebot

deploy: push
	ssh $(SERVER) "mkdir -p $(TARGET)"
	scp ./docker/production.yml $(SERVER):$(TARGET)/docker-compose.yml
	ssh $(SERVER) "cd $(TARGET) && docker-compose pull"
	ssh $(SERVER) "cd $(TARGET) && docker-compose up -d"
