# VueCrontab for developers

## versions
```
$ node -v
v11.5.0
$ npm -v
6.4.1
```

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
$ open test/build/web/VueCrontab_index.html
$ open test/build/web/VueCrontabMin_index.html
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

# release
```
## test
$ npm run test:unit
$ npm run dev-server
$ npm run test:e2e

## git add & commit
$ git add . && git commit "${message}"

## version update
$ (update package.json version)
  * npm version major
  * npm version minor
  * npm version patch
$ npm run build

## build test
$ npm run build:test
$ open test/build/web/VueCrontab_index.html
$ open test/build/web/VueCrontabMin_index.html

## push, publish, add tag.
$ git add . && git commit "[release $VERSION]" (v0.0.1)
$ git push
$ git tag $VERSION (v0.0.1)
$ git push origin $VERSION (v0.0.1)
$ npm publish
```