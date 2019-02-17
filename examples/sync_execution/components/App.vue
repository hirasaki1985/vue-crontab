<template>
  <div id="app">
    <div>
      <div class="random">{{ random_num }}</div>
      <div class="counter">{{ counter }}</div>
      <div class="status">{{ status === 1 ? '通信中' : '通信完了' }}</div>
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
      let response = await fetch('https://script.google.com/macros/s/AKfycbyB6dEeNfxbfDs-xbKw7eLzgtfHaqcQcguKz2seU-T7sIs14735/exec')
      let num = response.number || 0
      this.random_num = num
      this.counter = counter
      console.log(num)
      return num
    },

    async finishAPI () {
      console.log('finishAPI()')
    }

        /*
    executeAPI ({last_run, counter, last_result, type}) {
      let self = this
      console.log('executeAPI()')
      this.status = 1
      fetch('https://script.google.com/macros/s/AKfycbyB6dEeNfxbfDs-xbKw7eLzgtfHaqcQcguKz2seU-T7sIs14735/exec')
        .then(function(response) {
          return response.json()
        })
        .then(function(response) {
          self.random_num = response.number || 0
          self.counter = counter
          console.log(response.number)
        })
    },
    finishAPI () {
      console.log('finishAPI()')
      this.status = 0
    }
    */

  }
}
</script>

<style>
</style>
