import VueCrontabJob from '../../../../../src/VueCrontab/job/job'

describe('job test', () => {
  // constructor
  it('constructor', () => {
    console.log('## constructor()')
    let vueCrontabJob = new VueCrontabJob()

    expect(0).toEqual(vueCrontabJob.counter)
    expect(null).toEqual(vueCrontabJob.last_run)
    expect(null).toEqual(vueCrontabJob.getJob())
    expect(null).toEqual(vueCrontabJob.getInterval())
    expect({}).toEqual(vueCrontabJob.getLatestResult())
  })

  // check jobs
  it('check jobs', () => {
    console.log('## check jobs()')
    const testJob = function() {
      return 1
    }

    // ['interval', 'job']
    const tests: Array<any> = [
      {name: 'testjob', interval: '/1', job: testJob},
      {name: 'testjob2', interval: '10', job: testJob},
      {name: 'testjob3', interval: '* * * * 10', job: testJob}
    ]

    for (let i in tests) {
      let test = tests[i]

      let vueCrontabJob = new VueCrontabJob(test)
      expect(test.interval).toEqual(vueCrontabJob.getInterval())
      expect(test.job).toEqual(vueCrontabJob.getJob())
      expect(test).toEqual(vueCrontabJob.getSetting())
    }
  })

  // result
  it('result', () => {
    console.log('## result()')
    let counter = 0
    let countFunction = function() {
      return counter++
    }
    let vueCrontabJob = new VueCrontabJob({name: 'testjob', interval: '/1', job: countFunction})
    let job = vueCrontabJob.getJob()

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
      let job_result = job()

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
})
