import Vue from 'vue'
import VueCrontab from 'VueCrontab'
import store from './store'
import crontab from './crontab'
import App from './components/App.vue'

// Vue.use(Vuex)
Vue.use(VueCrontab)

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})

crontab()
