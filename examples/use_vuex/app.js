import Vue from 'vue'
// import Vuex from 'vuex'
import store from './store'
import VueCrontab from 'VueCrontab'
import App from './components/App.vue'

// Vue.use(Vuex)
Vue.use(VueCrontab)

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
