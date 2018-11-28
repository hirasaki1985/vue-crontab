// var assert = require('assert')
const webdriverio = require('webdriverio')
const assert = require('assert')


describe('install test', () => {
  it('counter', async () => {
    console.log('test webdriverio.spec.js counter()')
    browser.url('http://localhost:8080/simple_components')

    // get counter
    const count1 = browser.getText('.counter')
    console.log(count1)
    assert.equal(count1, '0')

    // click count
    browser.click('.count-up-button')

    // get counter
    const count2 = browser.getText('.counter')
    console.log(count2)
    assert.equal(count2, '1')

    // title webdriver.io
    /*
    browser.url('http://webdriver.io')
    //browser.getTitle().should.be.equal('WebdriverIO - WebDriver bindings for Node.js')
    const title = browser.getTitle()
    console.log(title)
    assert.equal(title, 'WebdriverIO - WebDriver bindings for Node.js')
    */
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
