import Vue from 'vue'
import VueCrontab from 'VueCrontab'
// import { mapGetters, mapActions, mapState } from 'vuex'
import store from '../store'
import { textChangeRangeIsUnchanged } from 'typescript';

export default () => {
  /* change the value of setInterval inside VueCrontab. */
  VueCrontab.setOption({
    interval: 100
  })

  let result = VueCrontab.addJob([
    {
      name: 'counter_second',
      interval: {
        seconds: '/1',
      },

      // TODO: can not find and run the function that vuex managed.
      // job: mapActions('sample', ['incrementSeconds'])['incrementSeconds']
      //job: store.dispatch('sample/incrementSeconds', {root: true})
      job: store.dispatch('sample/incrementSeconds')
    },
    {
      name: 'counter_millisecond',
      interval: {
        millisecond: '/1',
      },

      // TODO: can not find and run the function that vuex managed.
      // job: mapActions('sample', ['incrementMilliSecond'])
      // job: store.dispatch('sample/incrementMilliSecond', {root: true})
      job: store.dispatch('sample/incrementMilliSecond')
    }
  ])

  console.log("result = " + result)
}
