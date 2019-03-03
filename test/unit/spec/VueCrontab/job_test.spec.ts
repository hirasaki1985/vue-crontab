import VueCrontabJob from '../../../../src/VueCrontab/job'

describe('job test', () => {
  // constructor
  it('constructor', () => {
    console.log('## constructor()')
    const testJob = function() {
      return 1
    }

    let vueCrontabJob = new VueCrontabJob({name: 'testjob', interval: '0 /1', job: testJob})
    expect(0).toEqual(vueCrontabJob.counter)
    expect(undefined).toEqual(vueCrontabJob.last_run)
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

    // ['interval', 'job']
    const tests: Array<any> = [
      [{name: 'testjob', interval: '0 10', job: testJob, sync: 1}, new Date('2019-01-08T00:38:10.000')],
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
  it('execute multi jobs', async function() {
    console.log('## execute multi jobs()')
    let test_job_args = [{
      last_run: '',
      counter: 0,
      last_result: undefined,
      type: undefined
    },{
      last_run: '',
      counter: 0,
      last_result: undefined,
      type: undefined
    },]

    const testJob = function({last_run, counter, last_result, type}) {
      console.log('testJob()')
      console.log(last_run)
      console.log(counter)
      console.log(last_result)
      expect(test_job_args[0].counter).toEqual(counter)
      expect(test_job_args[0].last_result).toEqual(last_result)
      expect(test_job_args[0].type).toEqual(type)
      return 'result_testJob()_' + Number(counter + 1)
    }

    const testJob2 = function({last_run, counter, last_result, type}) {
      console.log('testJob2()')
      console.log(last_run)
      console.log(counter)
      console.log(last_result)
      expect(test_job_args[1].counter).toEqual(counter)
      expect(test_job_args[1].last_result).toEqual(last_result)
      expect(test_job_args[1].type).toEqual(type)
      return 'result_testJob2()_' + Number(counter * 10)
    }

    // ['interval', 'job']
    const tests: Array<any> = [
      [{name: 'testjob', interval: '0 10', job: [testJob, testJob2], sync: 1}, new Date('2019-01-08T00:38:10.000')],
    ]

    for (let i in tests) {
      console.log('test.')
      let test = tests[i]
      let exe_num = 0
      let vueCrontabJob = new VueCrontabJob(test[0])
      let execute_result: number = 0
      console.log(vueCrontabJob)
      console.log()

      // execute 01
      console.log('execute multi jobs 01')
      // await sleep(vueCrontabJob.execute, test[1], 1000)
      let result = await vueCrontabJob.execute(test[1])
      console.log(result)
      test_job_args[0].counter++
      test_job_args[0].last_result = 'result_testJob()_' + Number(test_job_args[0].counter)
      test_job_args[1].last_result = 'result_testJob2()_' + Number(test_job_args[1].counter * 10)
      test_job_args[1].counter++
      console.log('execute multi jobs 01 result')
      console.log()

      test_job_args[0].type = 'cron'
      test_job_args[1].type = 'cron'

      // execute 02
      console.log('execute multi jobs 02')
      // await sleep(vueCrontabJob.execute, test[1], 1000)
      result = await vueCrontabJob.execute(test[1])
      console.log(result)
      test_job_args[0].counter++
      test_job_args[0].last_result = 'result_testJob()_' + Number(test_job_args[0].counter)
      test_job_args[1].last_result = 'result_testJob2()_' + Number(test_job_args[1].counter * 10)
      test_job_args[1].counter++
      console.log('execute multi jobs 02 result')
      console.log()

      // execute 03
      console.log('execute multi jobs 03')
      // await sleep(vueCrontabJob.execute, test[1], 1000)
      result = await vueCrontabJob.execute(test[1])
      console.log(result)
      test_job_args[0].counter++
      test_job_args[0].last_result = 'result_testJob()_' + Number(test_job_args[0].counter)
      test_job_args[1].last_result = 'result_testJob2()_' + Number(test_job_args[1].counter * 10)
      test_job_args[1].counter++
      console.log('execute multi jobs 02 result')
      console.log()
    }
  })

  // start/stop job
  it('start/stop job', async function() {
    console.log('## start/stop job()')
    let test_job_args = [
      { execute_date: new Date('2019-01-08T00:38:10.000'),
        last_run: undefined,  counter: 0, last_result: undefined, type: undefined
      },
      { execute_date: new Date('2019-01-08T00:38:20.000'),
        last_run: new Date('2019-01-08T00:38:10.000'),  counter: 1, last_result: 100, type: 'cron'
      },
      { execute_date: new Date('2019-01-08T00:38:30.000'),
        last_run: new Date('2019-01-08T00:38:20.000'),  counter: 2, last_result: 101, type: 'manual'
      },
      { execute_date: new Date('2019-01-08T00:38:40.000'),
        last_run: new Date('2019-01-08T00:38:30.000'),  counter: 3, last_result: 102, type: 'cron'
      },
      { execute_date: new Date('2019-01-08T00:38:50.000'),
        last_run: new Date('2019-01-08T00:38:40.000'),  counter: 4, last_result: 103, type: 'manual'
      }
    ]
    let check_index = 0

    const testJob = function({last_run, counter, last_result, type}) {
      let target = test_job_args[check_index]
      console.log('testJob()')
      console.log(`last_run = ${last_run}`)
      console.log(`counter = ${counter}`)
      console.log(`last_result = ${last_result}`)
      console.log(`type = ${type}`)
      console.log(target)
      expect(target.last_run).toEqual(last_run)
      expect(target.counter).toEqual(counter)
      expect(target.last_result).toEqual(last_result)
      expect(target.type).toEqual(type)
      if (typeof(counter) === 'undefined') {
        return 100
      }
      return 100 + counter
    }

    // ['interval', 'job']
    const tests: Array<any> = [
      [{name: 'testjob', interval: '0 /10', job: [testJob], sync: 1}],
    ]

    for (let i in tests) {
      console.log('test.')
      let test = tests[i]
      let exe_num = 0
      let vueCrontabJob = new VueCrontabJob(test[0])

      // execute 01
      console.log('execute job 01')
      let target = test_job_args[check_index]
      let result = await vueCrontabJob.execute(target.execute_date)
      console.log(`result. check_index = ${check_index}`)
      console.log(result)
      expect(1).toEqual(result.code)
      check_index++
      console.log()

      // job stop
      vueCrontabJob.stop()

      // execute 02 (not run)
      console.log('execute job 02')
      target = test_job_args[check_index]
      result = await vueCrontabJob.execute(target.execute_date)
      console.log(`result. check_index = ${check_index}`)
      console.log(result)
      expect(-1).toEqual(result.code)
      // check_index++
      console.log()

      // execute 03 (manual execute)
      console.log('execute job 03')
      target = test_job_args[check_index]
      result = await vueCrontabJob.manualExecute()
      expect(1).toEqual(result.code)
      console.log(`result. check_index = ${check_index}`)
      console.log(result)
      check_index++
      test_job_args[check_index]['last_run'] = result.date
      console.log()

      // start
      vueCrontabJob.start()

      // execute 04 (run)
      console.log('execute job 04')
      target = test_job_args[check_index]
      result = await vueCrontabJob.execute(target.execute_date)
      expect(1).toEqual(result.code)
      console.log(`result. check_index = ${check_index}`)
      console.log(result)
      check_index++
      console.log()

      // execute 05 (manual execute)
      console.log('execute job 05')
      target = test_job_args[check_index]
      result = await vueCrontabJob.manualExecute()
      expect(1).toEqual(result.code)
      console.log(`result. check_index = ${check_index}`)
      console.log(result)
      check_index++
      test_job_args[check_index]['last_run'] = result.date
      console.log()

      // execute 06 (run)
      console.log('execute job 06')
      target = test_job_args[check_index]
      result = await vueCrontabJob.execute(target.execute_date)
      expect(1).toEqual(result.code)
      console.log(`result. check_index = ${check_index}`)
      console.log(result)
      console.log()
    }
  })

  // start/stop job
  it('condition test', async function() {
    console.log('## condition test()')

    let condition_return = true
    let condition2_return = true
    let job_expect = true
    let testJob = function({last_run, counter, last_result, type}) {
      expect(job_expect).toEqual(true)
    }
    let condition = function() {
      return condition_return
    }
    let condition2 = function() {
      return condition2_return
    }

    // job arguments, condition return, job expect
    const tests: Array<any> = [
      [{name: 'testjob', interval: '0 /10', job: [testJob], sync: 1, condition: condition}, true, true, 1],
      [{name: 'testjob', interval: '0 /10', job: [testJob], sync: 1, condition: condition}, false, true, -2],
    ]

    // single condition
    for (let i in tests) {
      let test = tests[i]
      let vueCrontabJob = new VueCrontabJob(test[0])
      condition_return = test[1]
      job_expect = test[2]

      let result = await vueCrontabJob.execute(new Date('2019-01-08T00:38:10.000'))
      expect(result.code).toEqual(test[3])
      console.log(result)
    }

    // job arguments, condition return, job expect
    const tests2: Array<any> = [
      [{name: 'testjob', interval: '0 /10', job: [testJob], sync: 1, condition: [condition, condition2]}, true, true, true, 1],
      [{name: 'testjob', interval: '0 /10', job: [testJob], sync: 1, condition: [condition, condition2]}, true, false, true, -2],
      [{name: 'testjob', interval: '0 /10', job: [testJob], sync: 1, condition: [condition, condition2]}, false, true, true, -2],
      [{name: 'testjob', interval: '0 /10', job: [testJob], sync: 1, condition: [condition, condition2]}, false, false, true, -2],
    ]

    // multi condition
    for (let i in tests2) {
      console.log('multi condition')
      let test = tests2[i]
      let vueCrontabJob = new VueCrontabJob(test[0])
      condition_return = test[1]
      condition2_return = test[2]
      job_expect = test[3]

      console.log(test)
      console.log(`condition_return = ${condition_return}`)
      console.log(`condition2_return = ${condition2_return}`)
      console.log(`job_expect = ${job_expect}`)
      console.log(`result_expect = ${test[4]}`)

      let result = await vueCrontabJob.execute(new Date('2019-01-08T00:38:10.000'))
      expect(result.code).toEqual(test[4])
      console.log(result)
    }
  })

  // execute as e2e of examples's multi_jobs
  it("execute as e2e of examples's multi_jobs", async function() {
    console.log("## execute as e2e of examples's multi_jobs()")

    let counter_milliseconds = 0
    let counter_seconds = 0
    let counter_minutes = 0
    let counter_hours = 0
    let counter_days = 0
    let counter_months = 0
    let counter_years = 0
    let counter_weeks = 0

    // ['interval', 'job']
    const tests: Array<any> = [
      // milliseconds
      [ {
          name: 'milliseconds',
          interval: {
            milliseconds: '*',
          },
          job: function() {
            console.log('App methods countmilliseconds()')
            counter_milliseconds += 1
            console.log(counter_milliseconds)
          },
          sync: 1
        },
        [
          [new Date('2019-01-08T00:38:10.000'), true],
          [new Date('2019-01-08T00:38:10.111'), true],
          [new Date('2019-01-08T00:38:10.567'), true],
          [new Date('2019-01-08T00:38:11.567'), true],
        ],
        4
      ],

      // seconds
      [ {
          name: 'seconds',
          interval: {
            milliseconds: '0', seconds: '/1',
          },
          job: function() {
            console.log('App methods countSeconds()')
            counter_seconds += 1
          },
          sync: 1
        },
        [
          [new Date('2019-01-08T00:38:10.000'), true],
          [new Date('2019-01-08T00:38:11.000'), true],
          [new Date('2019-01-08T00:38:11.100'), false],
        ],
        2
      ],

      // minutes
      [ {
          name: 'minutes',
          interval: {
            milliseconds: '0', seconds: '0', minutes: '/1',
          },
          job: function() {
            console.log('App methods countMinutes()')
            counter_minutes += 1
            // console.log(this.counter_minutes)
          },
          sync: 1
        },
        [
          [new Date('2019-01-08T00:38:00.000'), true],
          [new Date('2019-01-08T00:39:00.000'), true],
          [new Date('2019-01-08T00:40:00.000'), true],
          [new Date('2019-01-08T00:38:01.000'), false],
          [new Date('2019-01-08T00:38:00.100'), false],
        ],
        3
      ],

      // hours
      [ {
          name: 'hours',
          interval: {
            milliseconds: '0', seconds: '0', minutes: '0', hours: '/1'
          },
          job: function() {
            console.log('App methods countHours()')
            counter_hours += 1
            // console.log(this.counter_hours)
          },
          sync: 1
        },
        [
          [new Date('2019-01-08T00:00:00.000'), true],
          [new Date('2019-01-08T01:00:00.000'), true],
          [new Date('2019-01-08T23:00:00.000'), true],
          [new Date('2019-01-08T00:00:00.100'), false],
          [new Date('2019-01-08T00:00:01.000'), false],
          [new Date('2019-01-08T00:01:00.000'), false],
        ],
        3
      ],

      // days
      [ {
          name: 'days',
          interval: {
            milliseconds: '0', seconds: '0', minutes: '0', hours: '0', day: '/1'
          },
          job: function() {
            console.log('App methods countDays()')
            counter_days += 1
            // console.log(this.counter_days)
          },
          sync: 1
        },
        [
          [new Date('2019-01-08T00:00:00.000'), true],
          [new Date('2019-01-09T00:00:00.000'), true],
          [new Date('2019-01-10T00:00:00.000'), true],
          [new Date('2019-02-10T00:00:00.000'), true],
          [new Date('2020-02-10T00:00:00.000'), true],
          [new Date('2019-01-08T00:00:00.100'), false],
          [new Date('2019-01-08T00:00:01.000'), false],
          [new Date('2019-01-08T00:01:00.000'), false],
          [new Date('2019-01-08T01:00:00.000'), false],
          [new Date('2019-01-08T01:10:20.300'), false],
        ],
        5
      ],

      // months
      [ {
          name: 'months',
          interval: {
            milliseconds: '0', seconds: '0', minutes: '0', hours: '0', day: '1', month: '/1'
          },
          job: function() {
            console.log('App methods countMonths()')
            counter_months += 1
            // console.log(this.counter_months)
          },
          sync: 1
        },
        [
          [new Date('2019-01-01T00:00:00.000'), true],
          [new Date('2019-02-01T00:00:00.000'), true],
          [new Date('2019-03-01T00:00:00.000'), true],
          [new Date('2019-12-01T00:00:00.000'), true],
          [new Date('2019-01-31T00:00:00.000'), false],
          [new Date('2019-02-28T00:00:00.000'), false],
          [new Date('2019-12-31T00:00:00.000'), false],
          [new Date('2020-03-01T00:00:00.000'), true],
          [new Date('2020-03-01T00:00:00.100'), false],
          [new Date('2020-03-01T00:00:10.000'), false],
          [new Date('2020-03-01T00:10:00.000'), false],
          [new Date('2020-03-01T10:00:00.000'), false],
          [new Date('2020-03-02T00:00:00.000'), false],
        ],
        5
      ],

      // years
      [ {
          name: 'years',
          interval: {
            milliseconds: '0', seconds: '0', minutes: '0', hours: '0', day: '1', month: '1', year: '/1'
          },
          job: function() {
            console.log('App methods countYears()')
            counter_years += 1
            // console.log(this.counter_years)
          },
          sync: 1
        },
        [
          [new Date('2020-01-01T00:00:00.000'), true],
          [new Date('2021-01-01T00:00:00.000'), true],
          [new Date('2022-01-01T00:00:00.000'), true],
          [new Date('2020-01-01T00:00:00.100'), false],
          [new Date('2020-01-01T00:00:01.000'), false],
          [new Date('2020-01-01T00:01:00.000'), false],
          [new Date('2020-01-01T01:00:00.000'), false],
          [new Date('2020-01-02T00:00:00.000'), false],
          [new Date('2020-02-01T00:00:00.000'), false],
          [new Date('2020-12-01T00:00:00.000'), false],
          [new Date('2020-01-31T00:00:00.000'), false],
        ],
        3
      ],

      // weeks
      [ {
          name: 'weeks',
          interval: {
            milliseconds: '0', seconds: '0', minutes: '0', hours: '0', week: '0'
          },
          job: function () {
            console.log('App methods countWeeks()')
            counter_weeks += 1
            // console.log(this.counter_weeks)
          },
          sync: 1
        },
        [
          [new Date('2019-03-03T00:00:00.000'), true],
          [new Date('2019-03-10T00:00:00.000'), true],
          [new Date('2019-03-17T00:00:00.000'), true],
          [new Date('2019-03-24T00:00:00.000'), true],
          [new Date('2019-03-31T00:00:00.000'), true],
          [new Date('2019-04-07T00:00:00.000'), true],
          [new Date('2019-04-14T00:00:00.000'), true],
          [new Date('2019-04-14T00:00:00.100'), false],
          [new Date('2019-04-14T00:00:01.000'), false],
          [new Date('2019-04-14T00:01:00.000'), false],
          [new Date('2019-04-14T01:00:00.000'), false],
          [new Date('2019-04-15T00:00:00.000'), false],
          [new Date('2020-04-13T00:00:00.000'), false],
        ],
        7
      ]
    ]

    for (let i in tests) {
      console.log('one set test.')
      let one_set = tests[i]
      let setting = one_set[0]
      let test_dates = one_set[1]
      let counter_result = one_set[2]

      console.log(setting)
      let vueCrontabJob = new VueCrontabJob(setting)

      for (let j in test_dates) {
        console.log('one test.')
        let test_date = test_dates[j]
        let target_date = test_date[0]
        let target_result = test_date[1]

        let result = await vueCrontabJob.execute(target_date)
        let result_cnv = result.code == 1 ? true : false

        console.log(result)
        console.log(target_result)
        console.log(result_cnv)
        expect(target_result).toEqual(result_cnv)
      }

      console.log('counter check.')
      console.log(i)
      console.log(counter_result)

      switch (i) {
        case '0':
          expect(counter_milliseconds).toEqual(counter_result)
          break;
        case '1':
          expect(counter_seconds).toEqual(counter_result)
          break;
        case '2':
          expect(counter_minutes).toEqual(counter_result)
          break;
        case '3':
          expect(counter_hours).toEqual(counter_result)
          break;
        case '4':
          expect(counter_days).toEqual(counter_result)
          break;
        case '5':
          expect(counter_months).toEqual(counter_result)
          break;
        case '6':
          expect(counter_years).toEqual(counter_result)
          break;
        case '7':
          expect(counter_weeks).toEqual(counter_result)
          break;
      }
    }
  })
})
