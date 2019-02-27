<template>
  <div id="app">
    <div>
      <div class="counter1">every milleseconds: {{ counter1 }}</div>
      <div class="counter2">every seconds: {{ counter2 }}</div>
      <div class="counter3">every minutes: {{ counter3 }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      counter1: 0,
      counter2: 0,
      counter3: 0,
    }
  },
  created () {
    console.log('App created()')
    let result = this.$crontab.addJob([{
      name: 'milleseconds',
      interval: {
        milliseconds: '/1',
      },
      job: this.countMilleseconds
    },{
      name: 'seconds',
      interval: {
        seconds: '/1',
      },
      job: this.countSeconds
    }, {
      name: 'minutes',
      interval: {
        seconds: '0',
        minutes: '/1',
      },
      job: this.countMinutes
    }])
    console.log(result)
  },
  methods: {
    countMilleseconds () {
      console.log('App methods countMilleseconds()')
      this.counter1 += 1
      console.log(this.counter1)
    },
    countSeconds () {
      console.log('App methods countSeconds()')
      this.counter2 += 1
      console.log(this.counter2)
    },
    countMinutes () {
      console.log('App methods countMinutes()')
      this.counter3 += 1
      console.log(this.counter3)
    },
  }
}
</script>

<style>
</style>
