import Vue from 'vue'
import Vuex from 'vuex'
import sample from './modules/sample'
import crontab from '../crontab'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    sample
  }
})

crontab()
