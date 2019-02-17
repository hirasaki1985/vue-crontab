import Vue from 'vue'
import VueCrontab from 'VueCrontab'
import App from './components/App.vue'

/* change the value of setInterval inside VueCrontab. */
VueCrontab.setOption({
  interval: 100
})

Vue.use(VueCrontab)

new Vue({
  el: '#app',
  // config,
  render: h => h(App)
})
