# VueCrontab

> Periodic processing management system (crontab) running on Vue.js

## Introduction

VueCrontab is a plug-in for Vue.js that executes functions according to a specified schedule.
The schedule consists of hours, minutes, seconds, days of the week, etc. VueCrontab executes the specified function when it matches the date and time.
By using this you can easily implement periodic processing to run in the background.

## Install

```
$ npm install vue-crontab
```

## Examples

- [Simple vue component](https://github.com/hirasaki1985/vue-crontab/tree/master/examples/simple_vuecomponent)
- [Multi jobs](https://github.com/hirasaki1985/vue-crontab/tree/master/examples/multi_jobs)
- [Use with the Vuex](https://github.com/hirasaki1985/vue-crontab/tree/master/examples/use_vuex)
- [Additional condition of the function.](https://github.com/hirasaki1985/vue-crontab/tree/master/examples/additional_condition)
- [Async of the functions](https://github.com/hirasaki1985/vue-crontab/tree/master/examples/sync_execution)

## Usage

Counter updated every second.

```javascript
import Vue from 'vue'
import VueCrontab from 'VueCrontab'

Vue.use(VueCrontab)

new Vue({
  el: '#app',
  render: h => h(App)
})
```

```javascript
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
    let result = this.$crontab.addJob({
      name: 'counter',
      interval: {
        seconds: '/1',
      },
      job: this.countUp
    })
  },
  methods: {
    countUp () {
      this.counter += 1
    }
  }
}
</script>
```

## Reference
### VueCrontab
#### option

| name | type | description | default |
| ------------- | ------------- | ------------- | ------------- |
| interval | number | The interval to check the interval of the managed job.(milliseconds) | 1000 |
| auto_start | Boolean | Setting whether to automatically move cron when one or more jobs are reached. | true |

#### examples

call setOption before Vue.use() method.

```javascript
VueCrontab.setOption({
  interval: 100,
  auto_start: false
})

Vue.use(VueCrontab)
```

#### methods

| name | argument | description |
| ------------- | ------------- | ------------- |
| addJob | Array<Object> or Object |  |
| enableJob | string | Enable job with specified name. |
| disableJob | string | Disable job with specified name. |
| deleteJob | string | Delete job with specified name. |
| execJob | string | Manually execute the job with the specified name. |
| startCrontab | - | Stop the periodic processing of VueCrontab. |
| stopCrontab | - | Start the periodic processing of VueCrontab. |
| setOption | Object | change option of VueCrontab. |
| getOption | - | get option of VueCrontab. |

### Job
#### option

| name | type | description |
| ------------- | ------------- | ------------- |
| name (required) | String | job name. |
| interval (required) | Array<String or Object> or String or Object | Specify the periodical execution interval of the job. |
| job (required) | Array<Function> or Function | Specify the function you want to execute when matching the interval. |
| sync | number | Whether to synchronize and execute when multiple jobs are registered. 1 = sync, 0 = not sync(default) |
| condition | Array<Function> or Function | Add a function when you want to additionally specify job execution conditions in addition to interval. The condition must return Boolean type. |

#### interval
##### parameters

| name | range | default |
| ------------- | ------------- | ------------- |
| milliseconds | 0 - 9 | * |
| seconds | 0 - 59 | * |
| minutes | 0 - 59 | * |
| hours | 0 - 23 | * |
| day | 1 - 31 | * |
| month | 1 - 12 | * |
| year | 0 - | * |
| week | 0 - 6 (// Sunday is 0, Monday is 1, and so on.)| * |

##### Available symbols

| name  | description | examples |
| ------------- | ------------- | ------------- |
| * | All ranges | * |
| / | Number divided by 0 | /2 = every 2 seconds. /5 = every 5 seconds. |
| - | Within the specified numerical range | 0-10 = between 0 and 10 seconds. |
| , | Used to connect conditions | 0,1,2 ... 0,10-20,/7 ... |

##### interval examples

execute every 0.1 seconds
```javascript
{milliseconds: '/1'}
```

> If you want to process with milliseconds, change setOption as well.
```javascript
VueCrontab.setOption({
  interval: 100
})
```

execute every minute.
```javascript
{minutes: '/1'}
```

execute 0 minutes from 0 to 9 o'clock on the 1st of every month.
```javascript
{seconds: '0', minutes:'0', hours: '0-9', day: '1'}
```

1,3,5,10-15 o'clock Monday
```javascript
{week: '0', seconds: '0', minutes:'0', hours: '1,3,5,10-15'}
```

#### job arguments

| name | type | description |
| ------------- | ------------- | ------------- |
| exec_date | Date | Match date and time. |
| last_run | Date | Last execution date and time. |
| counter | number | Number of executions. |
| last_result | any | Return value of the previous function. |
| type | String | 'cron' = executed by periodic processing. 'manual = manually execution. |

```javascript
  methods: {
    countUp ({exec_date, last_run, counter, last_result, type}) {
      return "as the next last_result.";
    }
  }
```

## License

[MIT](https://github.com/hirasaki1985/vue-crontab/blob/master/LICENSE)
