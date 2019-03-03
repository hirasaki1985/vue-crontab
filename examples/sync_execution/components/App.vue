<template>
  <div id="app">
    <div>
      <div class="random">{{ random_num }}</div>
      <div class="counter">{{ counter }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      random_num: 0,
      counter: 0,
      status: 1
    }
  },
  created () {
    console.log('App created()')
    let result = this.$crontab.addJob({
      name: 'random_num',
      interval: {
        seconds: '/1',
      },
      sync: 1,
      job: [this.executeAPI, this.finishAPI]
    })
    console.log(result)
  },
  methods: {
    async executeAPI ({last_run, counter, last_result, type}) {
      console.log('executeAPI()')
      // let response = await fetch('http://example.com/ajax/getnum')
      // console.log(response)

      let fetch_result = Math.random()  // temp result.
      this.random_num = fetch_result
      this.counter = counter
      console.log(fetch_result)
      return fetch_result
    },

    async finishAPI () {
      console.log('finishAPI()')
    }
  }
}
</script>

<style>
</style>
