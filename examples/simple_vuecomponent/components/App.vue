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
    this.$crontab.addJob([
      {
        name: 'counter',
        interval: '/1',
        job: this.countUp
      },
    ])
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
