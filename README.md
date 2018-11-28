# Npm Test Module
## require
java (selenium using this)

## install
```
$ npm install
$ ./node_modules/.bin/selenium-standalone install
```

## develop
### web
```
$ npm run dev-server
```

#### access
http://localhost:8080/

## test
### unit test
```
$ npm run test:unit
```

### e2e test
```
$ npm run dev-server
$ npm run test:e2e
```

## build
```
$ npm run build
```

### build test
```
$ npm run build:test
```

## publish
```
$ npm publish
```

### publish test
```
$ npm i vue-crontab
```

## use docker
```
$ docker build -t vue-crontab .
$ docker run -d -v `pwd`:/home/circleci/npm-test --name vue-crontab -it vue-crontab bash
$ docker exec -it vue-crontab bash
```
