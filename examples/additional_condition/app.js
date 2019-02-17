import Vue from 'vue'
import VueCrontab from 'VueCrontab'
import App from './components/App.vue'

VueCrontab.setOption({
  interval: 100
})

Vue.use(VueCrontab)

new Vue({
  el: '#app',
  // config,
  render: h => h(App)
})
