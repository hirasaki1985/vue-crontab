// import Vue from 'vue'
import HirasakiNpmTest from 'hirasaki_npm_test'

// Vue.use(HirasakiNpmTest)

export default HirasakiNpmTest.addConfig([
  {
    name: 'config_name1',
    counter: 0,
    increment () {
      this.counter++
      return this.counter
    },
    getCount () {
      return this.counter
    }
  },
  {
    name: 'config_name2',
    counter: 100,
    increment () {
      this.counter++
      return this.counter
    },
    getCount () {
      return this.counter
    }
  }
])

/*
export default new VuePluginSample.VueSampleConfig({
  state: {
    counter: 0
  },
  mutations: {
    setCounter(state, param) {
      state.counter = param
    }
  },
  actions: {
    setCounter(context, payload) {
      context.commit('setCounter', payload)
    }
  },
  getters: {
    counter(state) {return state.counter }
  }
})
*/
