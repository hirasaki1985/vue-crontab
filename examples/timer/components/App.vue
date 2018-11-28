<template>
  <div id="app">
    <div>
      <div class="counter">{{ counter }}</div>
      <button class="count-up-button" v-on:click="countUp">count up</button>
    </div>
    <div>
      <div>{{ counter2 }}</div>
      <button v-on:click="countUp2">count up2</button>
    </div>
  </div>
</template>

<script>
// import HirasakiNpmTest from 'hirasaki_npm_test'

export default {
  data () {
    return {
      counter: 0,
      counter2: 100
    }
  },
  created () {
    console.log('App.vue created()')
    console.log(this.$hirasaki_npm_test)
    this.$hirasaki_npm_test.addConfig([
      {
        name: 'config_name1',
        timer: this.countUp
      },
      {
        name: 'config_name2',
        timer: this.countUp2
      }
    ])
    this.$hirasaki_npm_test.start()
    // this.counter = config.options.config_name1.getCount()
    // this.counter2 = config.options.config_name2.getCount()
    // this.counter = HirasakiNpmTest.getConfig('config_name1').getCount()
    // this.counter2 = HirasakiNpmTest.getConfig('config_name2').getCount()
  },
  methods: {
    countUp () {
      // this.$sample.count()
      // this.counter = this.$sample.getCount()
      // this.counter = config.options.config_name1.increment()
      this.counter += 1
    },
    countUp2 () {
      // this.counter2 = config.options.config_name2.increment()
      // this.counter2 = HirasakiNpmTest.getConfig('config_name2').increment()
      this.counter2 += 1
    }
  }
}
</script>

<style>
</style>

