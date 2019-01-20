import VueCrontab from '../../../../src/VueCrontab/index'

describe('VueCrontab test', () => {
  /*
  // startCrontab
  it('startCrontab', async function() {
    console.log('## startCrontab()')

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
    vueCrontab.deleteJob('test')
  })

  it('cron add and duplicate test.', () => {
    console.log('## cron add and duplicate test()')
    let vueCrontab = VueCrontab.getInstance()

    let add = [{
      name: 'test',
      job: function() {},
      interval: '* /1'
    }, {
      name: 'test',
      job: function() {},
      interval: '* /10'
    }]

    // no add
    console.log('no add')
    let duplicate_result = vueCrontab.isDuplicateJob('test')
    expect(duplicate_result).toEqual(false)
    console.log(duplicate_result)
    console.log()

    // add
    console.log('add 1')
    let add_result = vueCrontab.addJob(add[0])
    expect(add_result).toEqual(1)
    console.log(add_result)
    console.log()

    // add
    console.log('add 2')
    add_result = vueCrontab.addJob(add[1])
    expect(add_result).toEqual(0)
    console.log(add_result)
    console.log()

    // duplicate test
    console.log('duplicate test')
    duplicate_result = vueCrontab.isDuplicateJob('test')
    console.log(duplicate_result)
    expect(duplicate_result).toEqual(true)
    duplicate_result = vueCrontab.isDuplicateJob('test2')
    console.log(duplicate_result)
    expect(duplicate_result).toEqual(false)
    console.log()

    // delete
    console.log('delete')
    let del_result = vueCrontab.deleteJob('test')
    duplicate_result = vueCrontab.isDuplicateJob('test')
    expect(duplicate_result).toEqual(false)
    console.log(del_result)
    console.log(duplicate_result)
    console.log()

    // add
    console.log('add 3')
    add_result = vueCrontab.addJob(add[0])
    duplicate_result = vueCrontab.isDuplicateJob('test')
    expect(duplicate_result).toEqual(true)
    console.log(add_result)
    console.log(duplicate_result)
    console.log()

    console.log(vueCrontab)
    vueCrontab = null
  })
  */

  it('cron job enable/disable test.', () => {
    console.log('## cron job enable/disable test()')
    let vueCrontab = VueCrontab.getInstance()

    let adds = [{
      name: 'test',
      job: function() {},
      interval: '* /1'
    }, {
      name: 'test2',
      job: function() {},
      interval: '* /10'
    }, {
      name: 'test3',
      job: function() {},
      interval: '* /10'
    }]

    // add
    for (let i in adds) {
      vueCrontab.addJob(adds[i])
    }

    // test 1
    let test_state = [1, 1, 1]
    for (let i in adds) {
      let target_job = vueCrontab.getJob(adds[i]['name'])
      let target_state = target_job.getState()
      expect(test_state[i]).toEqual(target_state['status'])
    }

    // disable
    let disable_result = vueCrontab.disableJob('test')
    disable_result = vueCrontab.disableJob('test2')
    test_state = [0, 0, 1]
    for (let i in adds) {
      let target_job = vueCrontab.getJob(adds[i]['name'])
      let target_state = target_job.getState()
      expect(test_state[i]).toEqual(target_state['status'])
    }

    // disable
    disable_result = vueCrontab.disableJob('test3')
    test_state = [0, 0, 0]
    for (let i in adds) {
      let target_job = vueCrontab.getJob(adds[i]['name'])
      let target_state = target_job.getState()
      expect(test_state[i]).toEqual(target_state['status'])
    }

    // enable
    vueCrontab.enableJob('test2')
    test_state = [0, 1, 0]
    for (let i in adds) {
      let target_job = vueCrontab.getJob(adds[i]['name'])
      let target_state = target_job.getState()
      expect(test_state[i]).toEqual(target_state['status'])
    }

    // enable
    vueCrontab.enableJob('test')
    vueCrontab.enableJob('test3')
    test_state = [1, 1, 1]
    for (let i in adds) {
      let target_job = vueCrontab.getJob(adds[i]['name'])
      let target_state = target_job.getState()
      expect(test_state[i]).toEqual(target_state['status'])
    }

    //delete
    for (let i in adds) {
      vueCrontab.deleteJob(adds[i]['name'])
    }
  })
})

