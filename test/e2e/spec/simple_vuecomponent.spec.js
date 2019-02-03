// var assert = require('assert')
const webdriverio = require('webdriverio')
const assert = require('assert')

describe('counter test', () => {
  it('counter', async () => {
    console.log('test webdriverio.spec.js counter()')
    browser.url('http://localhost:8080/simple_vuecomponent')

    let tests = [
      {browser: browser, interval: 1000, max_count: 10, target_class: '.counter'}
    ]

    for (let i in tests) {
      let test = tests[i]
      let result = await countTest(test.browser, test.interval, test.max_count, test.target_class)
    }

    function countTest(use_browser, interval_num, max_count, target_class) {
      return new Promise((resolve) => {
        let interval = null
        let count = 0

        setInterval(function() {
          console.log('simple_vuecomponents counter test setInterval()')
          console.log(target_class)
          // test
          const count1 = use_browser.getText(target_class)
          // console.log(count1)
          // assert.equal(count1, count)
          count += 1

          // check count
          if (count >= max_count) {
            resolve()
          }
        }, interval_num)
      })
    }
  })
})

/*
var webdriverio = require('webdriverio')
var options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};
*/

/*
webdriverio
    .remote(options)
    .init()
    .url('http://www.google.com')
    .getTitle().then(function(title) {
        console.log('Title was: ' + title);
    })
    .end()
    .catch(function(err) {
        console.log(err);
    });
console.log('webdriverio end');
*/

/*
describe('webdriver.io page', function() {
  it('should be a pending test')
  it('should have the right title - the fancy generator way', function() {
    browser.url('http://webdriver.io/')
    var title = browser.getTitle()
    //assert.equal(title, 'WebdriverIO - WebDriver bindings for Node.js')
    expect(title).toEqual('WebdriverIO - WebDriver bindings for Node.js')
  })
})
*/
