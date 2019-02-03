<template>
  <div id="app">
    <div>
      <div id="counter">{{ counter }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  created () {
    console.log('App created()')
    let result = this.$crontab.addJob({
      name: 'counter',
      interval: {
        seconds: '/1',
      },
      job: this.increment
    })
  },
  methods: mapActions('sample', [
    'increment'
  ]),
  computed: {
    /*
    ...mapGetters('sample', {
      counter: 'getCounter',
    })
    */
    ...mapState('sample', {
      counter: state => state.counter,
    })
  }
}
</script>

<style>
</style>
