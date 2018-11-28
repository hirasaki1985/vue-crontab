import HirasakiNpmTest from '../../../src/HirasakiNpmTest'
// import Test from '../modules/test.ts'

describe('HirasakiNpmTest test', () => {
  it('counter', () => {
    HirasakiNpmTest.count()
    expect(HirasakiNpmTest.getCount()).toEqual(1)

    HirasakiNpmTest.count()
    expect(HirasakiNpmTest.getCount()).toEqual(2)

    HirasakiNpmTest.resetCount()
  })
})

// import Vue from 'vue'
// import VuePluginSample from '../../src/index'

// Vue.use(VuePluginSample)

// const sample = new VuePluginSample()

/*
const vue = new Vue({
  sample,
  template: `
    <div id="app">
      <h1>Basic</h1>
    </div>
  `
}).$mount('#app')
*/

/*
describe('install test', () => {
  it('counter', () => {
    sample.count()
    expect(sample.getCount()).toEqual(1)

    sample.count()
    expect(sample.getCount()).toEqual(2)
  })
})
*/
