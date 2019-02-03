<template>
  <div id="app">
    <div>
      <div class="counter">{{ counter }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      counter: 0
    }
  },
  created () {
    console.log('App created()')
    let result = this.$crontab.addJob({
      name: 'counter',
      interval: {
        seconds: '/1',
      },
      job: this.countUp
    })
  },
  methods: {
    countUp () {
      console.log('App methods countUp()')
      this.counter += 1
    }
  }
}
</script>

<style>
</style>
