import Vue from 'vue'
import VueCrontab from 'vue-crontab'
import { mapGetters, mapActions, mapState } from 'vuex'
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

      // TODO: can not run vuex actions.
      job: mapActions('sample', ['incrementSeconds'])['incrementSeconds']
    },
    {
      name: 'counter_millisecond',
      interval: {
        millisecond: '/1',
      },

      // TODO: can not run vuex actions.
      job: mapActions('sample', ['incrementMilliSecond'])
    }
  ])

  console.log(result)
}
