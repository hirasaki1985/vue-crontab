<template>
  <div id="app">
    <div>
      <div class="counter">{{ counter }}</div>
    </div>
    <div>
      <label><input type="radio" value="1" v-model="toggle"> start</label>
      <label><input type="radio" value="0" v-model="toggle"> stop</label>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      toggle: '1',
      counter: 0
    }
  },
  created () {
    let result = this.$crontab.addJob({
      name: 'counter',
      interval: {
        milliseconds: '*',
      },
      job: this.countUp,
      condition: this.myCondition
    })
  },
  methods: {
    countUp () {
      this.counter += 1
    },

    /**
     * Return true or false.
     * @return {Boolean}
     */
    myCondition () {
      return this.toggle === '1' ? true : false
    }
  }
}
</script>

<style>
</style>
