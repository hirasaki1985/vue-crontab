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
})
