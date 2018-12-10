import VueCrontabRecord from '../../../../../src/VueCrontab/record/record'

describe('crontab test', () => {
  // isMatch
  it('default option', () => {
    console.log('## record_test. default option.')
    let record = new VueCrontabRecord()
    console.log(record)

    // option check
    expect(record.max_rec_num).toEqual(1)
  })

  it('addResult', () => {
    console.log('## record_test. addResult.')
    const options: Array<Object> = [
      {},
      {max_rec_num: 5},
      {max_rec_num: 10}
    ]
    for (let i in options) {
      let option = options[i]
      console.log('test option')
      console.log(option)
      let record = new VueCrontabRecord(option)
      const addResults: Array<any> = [
        // match_date, job result
        [new Date('2018-12-03T01:28:05'), 1],
        [new Date('2018-12-03T01:28:10'), 2],
        [new Date('2018-12-03T01:28:15'), 3],
        [new Date('2018-12-03T01:28:20'), 4],
        [new Date('2018-12-03T01:28:25'), 5],
        [new Date('2018-12-03T01:28:30'), 6],
        [new Date('2018-12-03T01:28:35'), 7],
      ]

      for (let j in addResults) {
        console.log('addResult()')
        let add_result = record.addResult(addResults[j][0], addResults[j][1])
        let max_rec_num: number = Number(j) + 1
        if (typeof(option['max_rec_num']) === 'number' && max_rec_num > option['max_rec_num']) {
          max_rec_num = option['max_rec_num']
          console.log(record.getResults())
        } else if (typeof(option['max_rec_num']) === 'undefined') {
          max_rec_num = 1
        }
        console.log(add_result)
        console.log(max_rec_num)
        expect(add_result).toEqual(max_rec_num)
        console.log()
      }
      console.log(record.getResults())
    }
  })
})
