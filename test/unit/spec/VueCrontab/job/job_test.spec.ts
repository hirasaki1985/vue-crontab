import VueCrontabJob from '../../../../../src/VueCrontab/job/job'

describe('job test', () => {
  // constructor
  it('constructor', () => {
    console.log('## constructor()')
    const testJob = function() {
      return 1
    }

    let vueCrontabJob = new VueCrontabJob({name: 'testjob', interval: '0 /1', job: testJob})
    expect(0).toEqual(vueCrontabJob.counter)
    expect(null).toEqual(vueCrontabJob.last_run)
    expect({}).toEqual(vueCrontabJob.getLatestResult())
  })

  // check jobs
  it('check jobs', () => {
    console.log('## check jobs()')
    const testJob = function() {
      return 1
    }
    const testJob2 = function() {
      return 2
    }

    // ['interval', 'job']
    const tests: Array<any> = [
      [{name: 'testjob', interval: '0 /1', job: testJob}, 1],
      [{name: 'testjob2', interval: '0 10', job: testJob}, 1],
      [{name: 'testjob3', interval: '0 * * * * 10', job: testJob}, 1],
      [{name: 'testjob3', interval: {seconds: '/2'}, job: testJob}, 1],
      [{name: 'testjob3', interval: {minutes: '0,30', hours: '0'}, job: testJob}, 1],

      // multi intervals
      [{name: 'testjob4', interval: ['0 0 /10','0 0 /15'], job: testJob}, 1],
      [{name: 'testjob3', interval: [{minutes: '0-30', hours: '0-5'}, {minutes: '40', hours: '11,12'}], job: testJob}, 1],

      // multi jobs
      [{name: 'testjob5', interval: '0 * * * * 10', job: [testJob, testJob2]}, 1],

      // exceptions
      //  - name
      [{name: '', interval: '0 1 2', job: testJob}, 'exception'],
      //  - interval
      [{name: 'name', interval: '', job: testJob}, 'exception'],
      [{name: 'name', interval: '', job: testJob}, 'exception'],
      [{name: 'name', interval: 100, job: testJob}, 'exception'],
      [{name: 'name', interval: testJob, job: testJob}, 'exception'],
      [{name: 'name', interval: '100 * 10', job: testJob}, 'exception'],
      [{name: 'name', interval: '!"# 2', job: testJob}, 'exception'],
      [{name: 'name', interval: ['0 0 10', '!"# 2'], job: testJob}, 'exception'],
      [{name: 'name', interval: [100, '0 0 10'], job: testJob}, 'exception'],
      [{name: 'name', interval: ['0 0 10', '0 0 20', 0], job: testJob}, 'exception'],
      //  - job
      [{name: 'name', interval: '0 * 0', job: 0}, 'exception'],
      [{name: 'name', interval: '0 * 0', job: 'string'}, 'exception'],
      [{name: 'name', interval: '0 * 0', job: {test: 'test'}}, 'exception'],
      [{name: 'name', interval: '0 * 0', job: [testJob, 0]}, 'exception'],
      [{name: 'name', interval: '0 * 0', job: [testJob, testJob2, 0]}, 'exception'],
    ]

    for (let i in tests) {
      let test = tests[i]
      try {
        console.log('check jobs() test')
        console.log(test)
        let vueCrontabJob = new VueCrontabJob(test[0])
        expect(test[1]).toEqual(1)
        console.log(vueCrontabJob)
        console.log()
      } catch(err) {
        console.log('catch exception')
        // console.log(err)
        expect(test[1]).toEqual('exception')
        console.log()
      }
    }
  })

  // execute
  it('execute', async function() {
    console.log('## execute()')
    let test_job_args = {
      last_run: '',
      counter: 0,
      last_result: undefined,
      type: undefined
    }

    const testJob = function({last_run, counter, last_result, type}) {
      console.log('testJob()')
      console.log(last_run)
      console.log(counter)
      console.log(last_result)
      console.log(test_job_args)
      let result = 'result_testJob()_' + Number(counter + 1)
      expect(test_job_args.counter).toEqual(counter)
      expect(test_job_args.last_result).toEqual(last_result)
      expect(test_job_args.type).toEqual(type)
      return result
    }

    /*
    function sleep (fn, time) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(fn()), time)
      })
    }
    */

    // ['interval', 'job']
    const tests: Array<any> = [
      [{name: 'testjob', interval: '0 10', job: testJob}, new Date('2019-01-08T00:38:10.000')],
    ]

    for (let i in tests) {
      console.log('test.')
      let test = tests[i]
      let exe_num = 0
      let vueCrontabJob = new VueCrontabJob(test[0])
      let execute_result: number = 0

      // execute 01
      console.log('execute 01')
      execute_result = await vueCrontabJob.execute(test[1])
      console.log('execute 01 result')
      console.log(execute_result)
      test_job_args.counter++
      test_job_args.last_result = 'result_testJob()_' + Number(test_job_args.counter)
      test_job_args.type = 'cron'
      console.log()


      // execute 02
      console.log('execute 02')
      execute_result = await vueCrontabJob.execute(test[1])
      console.log('execute 02 result')
      console.log(execute_result)
      test_job_args.counter++
      test_job_args.last_result = 'result_testJob()_' + Number(test_job_args.counter)
      console.log()

      // execute 03
      console.log('execute 03')
      execute_result = await vueCrontabJob.execute(test[1])
      console.log('execute 03 result')
      console.log(execute_result)
      test_job_args.counter++
      test_job_args.last_result = 'result_testJob()_' + Number(test_job_args.counter)
      console.log()
    }
  })

  // execute multi jobs
  /*
  it('execute multi jobs', async function() {
    console.log('## execute multi jobs()')

    const testJob = function({last_run, counter, last_result}) {
      console.log('testJob()')
      console.log(last_run)
      console.log(counter)
      console.log(last_result)
      return 'result_testJob()_' + Number(counter + 1)
    }

    const testJob2 = function({last_run, counter, last_result}) {
      console.log('testJob2()')
      console.log(last_run)
      console.log(counter)
      console.log(last_result)
      return 'result_testJob2()_' + Number(counter * 10)
    }

    function sleep (fn, time) {
      return new Promise((resolve) => {
        // wait 3s before calling fn(par)
        setTimeout(() => resolve(fn()), time)
      })
    }

    // ['interval', 'job']
    const tests: Array<any> = [
      [{name: 'testjob', interval: '0 10', job: [testJob, testJob2]}, new Date('2019-01-08T00:38:10.000')],
    ]

    for (let i in tests) {
      console.log('test.')
      let test = tests[i]
      let exe_num = 0
      let vueCrontabJob = new VueCrontabJob(test[0])
      let execute_result: number = 0
      console.log(vueCrontabJob)
      console.log()

      console.log('execute multi jobs 01')
      await sleep(function() {
        execute_result = vueCrontabJob.execute(test[1])
        console.log(execute_result)
        exe_num++
      }, 1000)
      console.log()

      console.log('execute multi jobs 02')
      await sleep(function() {
        execute_result = vueCrontabJob.execute(test[1])
        console.log(execute_result)
        exe_num++
      }, 1000)
      console.log()

      console.log('stop')
      vueCrontabJob.stop()
      await sleep(function() {
        execute_result = vueCrontabJob.execute(test[1])
        console.log(execute_result)
        exe_num++
      }, 1000)
      console.log()

      console.log('execute multi jobs 03')
      vueCrontabJob.start()
      await sleep(function() {
        execute_result = vueCrontabJob.execute(test[1])
        console.log(execute_result)
        exe_num++
      }, 1000)
      console.log()
    }
  })
  */

  /*
  // result
  it('result', () => {
    console.log('## result()')
    let counter = 0
    let countFunction = function() {
      return counter++
    }
    let vueCrontabJob = new VueCrontabJob({name: 'testjob', interval: '/1', job: countFunction})
    let job:Array<Function> = vueCrontabJob.getJob()

    const results: Array<any> = [
      {match_date: new Date('2018-12-10T18:00:30')},
      {match_date: new Date('2018-12-10T18:01:00')},
      {match_date: new Date('2018-12-10T18:01:30')},
      {match_date: new Date('2018-12-10T18:02:00')},
      {match_date: new Date('2018-12-10T18:02:30')},
    ]

    for (let i in results) {
      let result = results[i]
      let now = new Date()
      let job_result = job[0]()

      // check setResult
      vueCrontabJob.setResult(result.match_date, job_result, now)
      let latest_result = vueCrontabJob.getLatestResult()
      console.log(latest_result)

      expect(result.match_date).toEqual(latest_result['match_date'])
      expect(job_result).toEqual(latest_result['result'])
      expect(now).toEqual(latest_result['finish_date'])

      // check getjobArguments
      let argument = vueCrontabJob.getJobArguments()
      console.log(argument)

      expect(result.match_date).toEqual(argument['last_run'])
      expect(Number(i) + 1).toEqual(argument['counter'])
      expect(job_result).toEqual(argument['last_result'])
      console.log()
    }
  })

  // validate
  it('validate', () => {
    console.log('## validate()')

    const validates: Array<any> = [
      // errors
      [{}, -4],
      [{name:''}, -1],
      [{name:1}, -1],
      [{name: function() {return 1}}, -1],
      [{name: 'test', job: 'aaa'}, -2],
      [{name: 'test', job: 1}, -2],
      [{name: 'test', job: Array()}, -2],
      [{name: 'test', job: Array(1, 2)}, -2],
      [{name: 'test', job: Array('a', 'a')}, -2],
      [{name: 'test', job: function() {return 1}, interval: 0}, -3],
      [{name: 'test', job: function() {return 1}, interval: function() {return 2}}, -3],
      [{name: 'test', job: function() {return 1}, interval: ''}, -3],

      // correct
      [{name: 'test_name', job: function () {return 1}, interval: '0'}, 1],
    ]

    let vueCrontabJob = new VueCrontabJob()
    for (let i in validates) {
      let target = validates[i]
      let result = vueCrontabJob.validate(target[0])

      console.log(target)
      console.log(result)
      expect(result).toEqual(target[1])
      console.log()
    }
  })
  */
})
