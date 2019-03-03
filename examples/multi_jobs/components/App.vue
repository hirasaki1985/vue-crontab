<template>
  <div id="app">
    <div>
      <div class="counter_milliseconds">every milliseconds: {{ counter_milliseconds }}</div>
      <div class="counter_seconds">every seconds: {{ counter_seconds }}</div>
      <div class="counter_minutes">every minutes: {{ counter_minutes }}</div>
      <div class="counter_hours">every hours: {{ counter_hours }}</div>
      <div class="counter_days">every days: {{ counter_days }}</div>
      <div class="counter_months">every months: {{ counter_months }}</div>
      <div class="counter_years">every years: {{ counter_years }}</div>
      <div class="counter_weeks">every weeks: {{ counter_weeks }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      counter_milliseconds: 0,
      counter_seconds: 0,
      counter_minutes: 0,
      counter_hours: 0,
      counter_days: 0,
      counter_months: 0,
      counter_years: 0,
      counter_weeks: 0,
    }
  },
  created () {
    console.log('App created()')
    let result = this.$crontab.addJob([
      {
        name: 'milliseconds',
        interval: {
          milliseconds: '*',
        },
        job: this.countmilliseconds
      },{
        name: 'seconds',
        interval: {
          milliseconds: '0', seconds: '/1',
        },
        job: this.countSeconds
      }, {
        name: 'minutes',
        interval: {
          milliseconds: '0', seconds: '0', minutes: '/1',
        },
        job: this.countMinutes
      }, {
        name: 'hours',
        interval: {
          milliseconds: '0', seconds: '0', minutes: '0', hours: '/1'
        },
        job: this.countHours
      }, {
        name: 'days',
        interval: {
          milliseconds: '0', seconds: '0', minutes: '0', hours: '0', day: '/1'
        },
        job: this.countDays
      }, {
        name: 'months',
        interval: {
          milliseconds: '0', seconds: '0', minutes: '0', hours: '0', day: '1', month: '/1'
        },
        job: this.countMonths
      }, {
        name: 'years',
        interval: {
          milliseconds: '0', seconds: '0', minutes: '0', hours: '0', day: '1', month: '1', year: '/1'
        },
        job: this.countYears
      }, {
        name: 'weeks',
        interval: {
          milliseconds: '0', seconds: '0', minutes: '0', hours: '0', week: '0'
        },
        job: this.countWeeks
      }
    ])
    console.log(result)
  },
  methods: {
    countmilliseconds () {
      console.log('App methods countmilliseconds()')
      this.counter_milliseconds += 1
      console.log(this.counter_milliseconds)
    },
    countSeconds () {
      console.log('App methods countSeconds()')
      this.counter_seconds += 1
      console.log(this.counter_seconds)
    },
    countMinutes () {
      console.log('App methods countMinutes()')
      this.counter_minutes += 1
      console.log(this.counter_minutes)
    },
    countHours () {
      console.log('App methods countHours()')
      this.counter_hours += 1
      console.log(this.counter_hours)
    },
    countDays () {
      console.log('App methods countDays()')
      this.counter_days += 1
      console.log(this.counter_days)
    },
    countMonths () {
      console.log('App methods countMonths()')
      this.counter_months += 1
      console.log(this.counter_months)
    },
    countYears () {
      console.log('App methods countYears()')
      this.counter_years += 1
      console.log(this.counter_years)
    },
    countWeeks () {
      console.log('App methods countWeeks()')
      this.counter_weeks += 1
      console.log(this.counter_weeks)
    }
  }
}
</script>

<style>
</style>
