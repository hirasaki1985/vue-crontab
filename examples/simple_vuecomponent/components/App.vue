<template>
  <div id="app">
    <div>
      <div class="counter">{{ counter }}</div>
    </div>
  </div>
</template>

<script>
// import HirasakiNpmTest from 'hirasaki_npm_test'
export default {
  data () {
    return {
      counter: 0
    }
  },
  created () {
    this.$crontab.addConfig([
      {
        name: 'counter',
        interval: '0 * * * *',
        job: this.countUp
      },
    ])
    this.$crontab.start()
  },
  methods: {
    countUp () {
      this.counter += 1
    }
  }
}
</script>

<style>
</style>
