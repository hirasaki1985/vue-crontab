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
import HirasakiNpmTest from 'hirasaki_npm_test'
import config from '../config/config'

export default {
  data () {
    return {
      counter: 0,
      counter2: 0
    }
  },
  created () {
    console.log('App.vue created()')
    // this.counter = config.options.config_name1.getCount()
    // this.counter2 = config.options.config_name2.getCount()
    this.counter = HirasakiNpmTest.getConfig('config_name1').getCount()
    this.counter2 = HirasakiNpmTest.getConfig('config_name2').getCount()
  },
  methods: {
    countUp () {
      // this.$sample.count()
      // this.counter = this.$sample.getCount()
      // this.counter = config.options.config_name1.increment()
      this.counter = HirasakiNpmTest.getConfig('config_name1').increment()
    },
    countUp2 () {
      // this.counter2 = config.options.config_name2.increment()
      this.counter2 = HirasakiNpmTest.getConfig('config_name2').increment()
    }
  }
}
</script>

<style>
</style>

