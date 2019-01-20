import VueCrontab from '../../../../src/VueCrontab/index'

describe('VueCrontab test', () => {
  // startCrontab
  it('startCrontab', async function() {
    console.log('## startCrontab()')
    /*
    beforeEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    })
    */
    // jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000

    let vueCrontab:VueCrontab = VueCrontab.getInstance()
    vueCrontab.setOption({
      auto_start: false
    })

    // no job.
    let start_result: number = vueCrontab.startCrontab()
    expect(start_result).toEqual(0)
    console.log(start_result)
    console.log()

    let job_args = {
      last_run: undefined,
      counter: 0,
      last_result: undefined,
      type: undefined
    }
    let testJob = function({exec_date, last_run, counter, last_result, type}) {
      console.log('testJob()')
      console.log(`exec_date = ${exec_date}`)
      console.log(`last_run = ${last_run}`)
      console.log(`counter = ${counter}`)
      console.log(`last_result = ${last_result}`)
      console.log(`type = ${type}`)
      console.log(job_args)

      expect(job_args.last_run).toEqual(last_run)
      expect(job_args.counter).toEqual(counter)
      expect(job_args.last_result).toEqual(last_result)
      expect(job_args.type).toEqual(type)

      job_args.last_run = exec_date
      job_args.counter = counter + 1
      job_args.last_result = counter * 10
      job_args.type = 'cron'
      console.log()
      return counter * 10
    }

    vueCrontab.addJob({
      name: 'test',
      job: testJob,
      interval: '* /1'
    })

    function sleep (fn, time) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(fn()), time)
      })
    }

    start_result = vueCrontab.startCrontab()
    expect(start_result).toEqual(1)
    console.log(start_result)
    console.log()

    start_result = vueCrontab.startCrontab()
    expect(start_result).toEqual(2)
    console.log(start_result)
    console.log()

    await sleep(function() {return 1}, 4500)

    vueCrontab.stopCrontab()
    console.log(vueCrontab)
  })

  it('cron add and duplicate test.', () => {
    console.log('## cron add and duplicate test()')
    let vueCrontab = VueCrontab.getInstance()

    // [{}]
  })
})

