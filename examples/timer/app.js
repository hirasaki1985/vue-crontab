import Vue from 'vue'
import HirasakiNpmTest from 'hirasaki_npm_test'
import App from './components/App.vue'
// import config from './config/config'

Vue.use(HirasakiNpmTest)
HirasakiNpmTest.setCoreOption({
  timer: 1000
})
// const sample = new VuePluginSample.HirasakiNpmTest()

new Vue({
  el: '#app',
  // config,
  render: h => h(App)
})