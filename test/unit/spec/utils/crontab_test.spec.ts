import Crontab from '../../../../src/utils/Crontab'

describe('Crontab test', () => {
  // isMatch
  it('isMatch()', () => {
    console.log('## isMatch test')
    const tests: Array<any> = [
      // seconds minutes hours day month year week
      ['10',          new Date('2018-12-03T14:28:10'), 1],
      ['10',          new Date('2017-09-09T23:00:10'), 1],
      ['11',          new Date('2018-12-03T14:28:10'), 0],
      ['* 28',        new Date('2018-12-03T14:28:23'), 1],
      ['* 29',        new Date('2018-12-03T14:28:23'), 0],
      ['9 28',        new Date('2018-12-03T14:28:10'), 0],
      ['* 28 14',     new Date('2018-12-03T14:28:10'), 1],
      ['10 28 14',    new Date('2018-12-03T14:28:10'), 1],
      ['10 28 13',    new Date('2018-12-03T14:28:10'), 0],
      ['10 28 *',     new Date('2018-12-03T14:28:10'), 1],
      ['10 28 * 3',       new Date('2018-12-03T14:28:10'), 1],
      ['10 28 * 03 12',   new Date('2018-12-03T14:28:10'), 1],
      ['10 28 * 3 *',     new Date('2018-12-03T14:28:10'), 1],
      ['10 28 * 3 11',    new Date('2018-12-03T14:28:10'), 0],
      ['* * * 3 12 2018', new Date('2018-12-03T14:28:10'), 1],
      ['* * * 3 12 2017', new Date('2018-12-03T14:28:10'), 0],
      ['/5 * 1',     new Date('2018-12-03T01:28:05'), 1],
      ['/5 * 1',     new Date('2018-12-03T01:28:10'), 1],
      ['/5 * 1',     new Date('2018-12-03T01:28:20'), 1],
      ['/5 * 1',     new Date('2018-12-03T01:28:21'), 0],
      ['/5 * 1',     new Date('2018-12-03T02:28:20'), 0],
      ['* /30 22-24,0-5',     new Date('2018-12-02T21:30:12'), 0],
      ['* /30 22-24,0-5',     new Date('2018-12-02T22:00:12'), 1],
      ['* /30 22-24,0-5',     new Date('2018-12-02T22:30:12'), 1],
      ['* /30 22-24,0-5',     new Date('2018-12-03T02:30:12'), 1],
      ['* /30 22-24,0-5',     new Date('2018-12-03T00:30:12'), 1],
      ['* /30 22-24,0-5',     new Date('2018-12-03T01:00:12'), 1],
      ['* /30 22-24,0-5',     new Date('2018-12-03T04:30:12'), 1],
      ['* /30 22-24,0-5',     new Date('2018-12-03T05:00:12'), 1],
      ['* /30 22-24,0-5',     new Date('2018-12-03T05:30:12'), 1],
      ['* /30 22-24,0-5',     new Date('2018-12-03T06:00:12'), 0],
      ['* * * * * * 0',     new Date('2018-12-02T06:00:12'), 1],
      ['* * * * * * 0',     new Date('2018-12-03T06:00:12'), 0],
      ['* * * * * * 1',     new Date('2018-12-03T06:00:12'), 1],
      ['',     new Date('2018-12-03T06:00:12'), 0],
    ]

    for (const test in tests) {
      console.log('### test')
      const target_test = tests[test]
      console.log(target_test)
      try {
        let result = Crontab.isMatch(target_test[0], target_test[1])
        console.log(result)
        expect(result).toEqual(target_test[2])
      } catch(err) {
        console.log('catch exception')
        // console.log(err)
        expect(target_test[2]).toEqual('exception')
      }
      console.log()
    }
  })

  // isMatchPart
  it('isMatchPart()', () => {
    console.log('## isMatchPart test')

    // [part, time, result]
    const tests: Array<any> = [
      // comma
      ['20', 20, 1],
      ['20', 19, 0],
      ['0,33', 0, 1],
      ['29,55', 55, 1],
      ['10,33', 0, 0],

      // slash
      ['/5', 5, 1],
      ['/5', 10, 1],
      ['/10', 50, 1],
      ['/5', 0, 1],
      ['/3', 2, 0],
      ['/3', 2, 0],
      ['20,/7', 20, 1],
      ['20,/7', 21, 1],
      ['20,/7', 22, 0],
      ['20,/7,40', 40, 1],
      ['/11,/13,/17', 11, 1],
      ['/11,/13,/17', 13, 1],
      ['/11,/13,/17', 17, 1],
      ['/11,/13,/17', 22, 1],
      ['/11,/13,/17', 12, 0],
      ['/11,/13,/17', 14, 0],
      ['/11,/13,/17', 18, 0],

      // hyphen
      ['5-10', 4, 0],
      ['5-10', 5, 1],
      ['5-10', 10, 1],
      ['5-10', 11, 0],
      ['-3', 0, 1],
      ['-3', 2, 1],
      ['-3', 3, 1],
      ['-3', 4, 0],
      ['14-', 13, 0],
      ['14-', 14, 1],
      ['14-', 15, 1],
      ['10,20-25,30', 10, 1],
      ['10,20-25,30', 30, 1],
      ['10,20-25,30', 19, 0],
      ['10,20-25,30', 20, 1],
      ['10,20-25,30', 25, 1],
      ['10,20-25,30', 26, 0],
      ['10,20-25,30,36-36', 36, 1],
      ['10,20-', 10, 1],
      ['10,20-', 19, 0],
      ['10,20-', 20, 1],
      ['10,20-', 21, 1],
      ['0,-20', 0, 1],
      ['0,-20', 1, 1],
      ['0,-20', 19, 1],
      ['0,-20', 20, 1],
      ['0,-20', 21, 0],
      ['0,-20', 22, 0],
      ['0,-20,40', 40, 1],

      // errors
      ['abc', 12, 0],
      [')#(\'$%)0', 0, 0],
      [',,,', 12, 'exception'],
      ['10,', 12, 'exception'],
      ['10,,', 12, 'exception'],
      ['//', 0, 'exception'],
      ['/aaa/)#U($', 0, 'exception'],
      [',/,,/,)#,', 0, 'exception'],
      ['5-0', 5, 0],
    ]

    for (const test in tests) {
      console.log('### test')
      const target_test = tests[test]
      console.log(target_test)

      try {
        let result = Crontab.isMatchPart(target_test[0], target_test[1])
        console.log(result)
        expect(result).toEqual(target_test[2])
      } catch(err) {
        console.log('catch exception')
        // console.log(err)
        expect(target_test[2]).toEqual('exception')
      }
      console.log()
    }
  })

  // stringToObject
  it('stringToObject()', () => {
    console.log('## stringToObject test')
    const keys = ['milliseconds', 'seconds', 'minutes', 'hours', 'day', 'month', 'year', 'week']
    const tests: Array<any> = [
      ['1', {milliseconds: '1'}],
      ['/10', {milliseconds: '/10'}],
      ['* 0', {seconds: '0'}],
      ['* 10-20', {seconds: '10-20'}],
      ['* * 55', {minutes: '55'}],
      ['* * *', {minutes: '*'}],
      ['* * * 13', {hours: '13'}],
      ['* * * 1,2,3', {hours: '1,2,3'}],
      ['* * * * 28', {day: '28'}],
      ['* * * * -15', {day: '-15'}],
      ['* * * * * 1', {month: '1'}],
      ['* * * * * 1,3,7-9', {month: '1,3,7-9'}],
      ['* * * * * * 2000', {year: '2000'}],
      ['* * * * * * /2', {year: '/2'}],
      ['* * * * * * * 0', {week: '0'}],
      ['* * * * * * * 1,3,5', {week: '1,3,5'}],
      ['1 2 * *', {milliseconds: '1', seconds: '2'}],
      ['* 2,4,6 * 1-10', {seconds: '2,4,6', hours: '1-10'}],
      ['* * 2-11,20 * * -5', {minutes: '2-11,20', month: '-5'}],
      ['0 1 2 3 4 5 6 7', {milliseconds: '0', seconds: '1', minutes: '2', hours: '3', day: '4', month: '5', year: '6', week: '7'}],
    ]

    for (let i in tests) {
      let result = Crontab.stringToObject(tests[i][0])
      const test_target = tests[i][1]
      console.log('stringToObject() one test')
      console.log(tests[i])
      console.log(result)

      for (let j in keys) {
        const check_key = keys[j]
        const test_value = test_target[check_key] !== undefined ? test_target[check_key] : '*'

        expect(result[check_key]).toEqual(test_value)
      }
      console.log()
    }
  })

  // convertDateToObject
  it('convertDateToObject()', () => {
    console.log('## convertDateToObject test')

    const tests: Array<any> = [
      [new Date('2020-05-12T09:55:33'), {
        milliseconds: 0, seconds: 33, minutes: 55, hours: 9,
        day: 12, month: 5, year: 2020, week: 2
      }],
      [new Date('2018-12-03T14:28:10.099'), {
        milliseconds: 0, seconds: 10, minutes: 28, hours: 14,
        day: 3, month: 12, year: 2018, week: 1
      }],
      [new Date('2018-12-03T14:28:10.100'), {
        milliseconds: 1, seconds: 10, minutes: 28, hours: 14,
        day: 3, month: 12, year: 2018, week: 1
      }],
      [new Date('2018-12-03T14:28:10.101'), {
        milliseconds: 1, seconds: 10, minutes: 28, hours: 14,
        day: 3, month: 12, year: 2018, week: 1
      }],
      [new Date('2018-12-03T14:28:10.432'), {
        milliseconds: 4, seconds: 10, minutes: 28, hours: 14,
        day: 3, month: 12, year: 2018, week: 1
      }],
      [new Date('2018-12-03T14:28:10.512'), {
        milliseconds: 5, seconds: 10, minutes: 28, hours: 14,
        day: 3, month: 12, year: 2018, week: 1
      }],
      [new Date('2018-12-03T14:28:10.999'), {
        milliseconds: 9, seconds: 10, minutes: 28, hours: 14,
        day: 3, month: 12, year: 2018, week: 1
      }],
    ]

    for (let i in tests) {
      let target = tests[i]
      let result = Crontab.convertDateToObject(target[0])
      console.log(target)
      console.log(result)

      expect(result).toEqual(target[1])
      console.log()
    }
  })
})
