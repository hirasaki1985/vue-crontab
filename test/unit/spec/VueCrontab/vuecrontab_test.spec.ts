import VueCrontab from '../../../../src/VueCrontab/index'

describe('VueCrontab test', () => {
  // startCrontab
  it('startCrontab', () => {
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

    vueCrontab.addJob({
      name: 'test',
      job: function() {return 1},
      interval: '* * * * * 10'
    })

    start_result = vueCrontab.startCrontab()
    expect(start_result).toEqual(1)
    console.log(start_result)
    console.log()

    start_result = vueCrontab.startCrontab()
    expect(start_result).toEqual(2)
    console.log(start_result)
    console.log()

    vueCrontab.stopCrontab()
  })

  it('cron add and duplicate test.', () => {
    console.log('## cron add and duplicate test()')
    let vueCrontab = VueCrontab.getInstance()

    // [{}]
  })
})

