import Vue from 'vue'
import HirasakiNpmTest from 'hirasaki_npm_test'

Vue.use(HirasakiNpmTest)

// const sample = new VuePluginSample()

new Vue({
  template: `
    <div id="app">
      <h1>Basic</h1>
    </div>
  `
}).$mount('#app')

