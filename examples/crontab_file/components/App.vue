<template>
  <div id="app">
    <div>
      <div id="counter_seconds">
        <p>update every seconds</p>
        <p>{{ counter_seconds }}</p>
      </div>
      <div id="counter_millisecond">
        <p>update every millisecond</p>
        <p>{{ counter_millisecond }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('sample', {
      counter_seconds: state => state.counter_seconds,
      counter_millisecond: state => state.counter_millisecond,
    })
  }
}
</script>

<style>
</style>
