import VueCrontabJob from '../../../../../src/VueCrontab/job/job'

describe('job test', () => {
  // constructor
  it('constructor', () => {
    console.log('## constructor()')
    let vueCrontabJob = new VueCrontabJob()

    expect(0).toEqual(vueCrontabJob.counter)
    expect(null).toEqual(vueCrontabJob.last_run)
    expect([]).toEqual(vueCrontabJob.getJob())
    expect([]).toEqual(vueCrontabJob.getInterval())
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
      {name: 'testjob', interval: '/1', job: testJob},
      {name: 'testjob2', interval: '10', job: testJob},
      {name: 'testjob3', interval: '* * * * 10', job: testJob},

      // multi intervals
      {name: 'testjob4', interval: ['* * * * 10','* * * * 15'], job: testJob},

      // multi jobs
      {name: 'testjob5', interval: '* * * * 10', job: [testJob, testJob2]}
    ]

    for (let i in tests) {
      let test = tests[i]
      let vueCrontabJob = new VueCrontabJob(test)

      console.log(test)
      console.log(vueCrontabJob.getInterval())
      console.log(vueCrontabJob.getJob())
      expect(test.interval).toEqual(vueCrontabJob.getInterval())
      expect(test.job).toEqual(vueCrontabJob.getJob())
      expect(test).toEqual(vueCrontabJob.getSetting())
    }
  })

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
