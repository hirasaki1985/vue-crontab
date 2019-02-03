const webdriverio = require('webdriverio')
const assert = require('assert')

describe('counter test', () => {
  it('counter', async () => {
    console.log('test webdriverio.spec.js counter()')
    browser.url('http://localhost:8080/use_vuex')

    let tests = [
      {browser: browser, interval: 1000, max_count: 10, target_class: '#counter'}
    ]

    for (let i in tests) {
      let test = tests[i]
      let result = await countTest(test.browser, test.interval, test.max_count, test.target_class)
    }

    function countTest(use_browser, interval_num, max_count, target_class) {
      return new Promise((resolve) => {
        let interval = null
        let count = null
        let target = use_browser.$(target_class)

        let milleseconds = 0
        do {
          let date = new Date()
          milleseconds = date.getMilliseconds()
        } while (!(940 <= milleseconds && milleseconds <= 960))

        let interval_obj = setInterval(async () => {
          console.log('use_vuex counter test setInterval()')
          // get string
          const count1 = await target.getText()

          // first execution
          if (count === null) {
            console.log('count == null')
            count = Number(count1)
            console.log(count)
            console.log(count1)
            return
          }

          // test
          count += 1
          console.log(count)
          console.log(count1)
          assert.equal(count1, count)

          // check count
          if (count >= max_count) {
            clearInterval(interval_obj)
            resolve()
          }
        }, interval_num)
      })
    }
  })
})
