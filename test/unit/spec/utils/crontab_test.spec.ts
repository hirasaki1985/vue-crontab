import crontab from '../../../../src/utils/crontab'

describe('crontab test', () => {
  // isMatch
  it('isMatch()', () => {
    console.log('## isMatch test')
    const tests: Array<any> = [
      // seconds minutes hours day month year week
      ['10',          new Date('2018-12-03T14:28:10'), true],
      ['10',          new Date('2017-09-09T23:00:10'), true],
      ['11',          new Date('2018-12-03T14:28:10'), false],
      ['* 28',        new Date('2018-12-03T14:28:23'), true],
      ['* 29',        new Date('2018-12-03T14:28:23'), false],
      ['9 28',        new Date('2018-12-03T14:28:10'), false],
      ['* 28 14',     new Date('2018-12-03T14:28:10'), true],
      ['10 28 14',    new Date('2018-12-03T14:28:10'), true],
      ['10 28 13',    new Date('2018-12-03T14:28:10'), false],
      ['10 28 *',     new Date('2018-12-03T14:28:10'), true],
      ['10 28 * 3',       new Date('2018-12-03T14:28:10'), true],
      ['10 28 * 03 12',   new Date('2018-12-03T14:28:10'), true],
      ['10 28 * 3 *',     new Date('2018-12-03T14:28:10'), true],
      ['10 28 * 3 11',    new Date('2018-12-03T14:28:10'), false],
      ['* * * 3 12 2018', new Date('2018-12-03T14:28:10'), true],
      ['* * * 3 12 2017', new Date('2018-12-03T14:28:10'), false],
      ['/5 * 1',     new Date('2018-12-03T01:28:05'), true],
      ['/5 * 1',     new Date('2018-12-03T01:28:10'), true],
      ['/5 * 1',     new Date('2018-12-03T01:28:20'), true],
      ['/5 * 1',     new Date('2018-12-03T01:28:21'), false],
      ['/5 * 1',     new Date('2018-12-03T02:28:20'), false],
      ['* /30 22-24,0-5',     new Date('2018-12-02T21:30:12'), false],
      ['* /30 22-24,0-5',     new Date('2018-12-02T22:00:12'), true],
      ['* /30 22-24,0-5',     new Date('2018-12-02T22:30:12'), true],
      ['* /30 22-24,0-5',     new Date('2018-12-03T02:30:12'), true],
      ['* /30 22-24,0-5',     new Date('2018-12-03T00:30:12'), true],
      ['* /30 22-24,0-5',     new Date('2018-12-03T01:00:12'), true],
      ['* /30 22-24,0-5',     new Date('2018-12-03T04:30:12'), true],
      ['* /30 22-24,0-5',     new Date('2018-12-03T05:00:12'), true],
      ['* /30 22-24,0-5',     new Date('2018-12-03T05:30:12'), true],
      ['* /30 22-24,0-5',     new Date('2018-12-03T06:00:12'), false],
      ['* * * * * * 0',     new Date('2018-12-02T06:00:12'), true],
      ['* * * * * * 0',     new Date('2018-12-03T06:00:12'), false],
      ['* * * * * * 1',     new Date('2018-12-03T06:00:12'), true],
      ['',     new Date('2018-12-03T06:00:12'), false],
    ]

    for (const test in tests) {
      console.log('### test')
      const target_test = tests[test]
      console.log(target_test)
      try {
        let result = crontab.isMatch(target_test[0], target_test[1])
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
      ['20', 20, true],
      ['20', 19, false],
      ['0,33', 0, true],
      ['29,55', 55, true],
      ['10,33', 0, false],

      // slash
      ['/5', 5, true],
      ['/5', 10, true],
      ['/10', 50, true],
      ['/5', 0, true],
      ['/3', 2, false],
      ['/3', 2, false],
      ['20,/7', 20, true],
      ['20,/7', 21, true],
      ['20,/7', 22, false],
      ['20,/7,40', 40, true],
      ['/11,/13,/17', 11, true],
      ['/11,/13,/17', 13, true],
      ['/11,/13,/17', 17, true],
      ['/11,/13,/17', 22, true],
      ['/11,/13,/17', 12, false],
      ['/11,/13,/17', 14, false],
      ['/11,/13,/17', 18, false],

      // hyphen
      ['5-10', 4, false],
      ['5-10', 5, true],
      ['5-10', 10, true],
      ['5-10', 11, false],
      ['-3', 0, true],
      ['-3', 2, true],
      ['-3', 3, true],
      ['-3', 4, false],
      ['14-', 13, false],
      ['14-', 14, true],
      ['14-', 15, true],
      ['10,20-25,30', 10, true],
      ['10,20-25,30', 30, true],
      ['10,20-25,30', 19, false],
      ['10,20-25,30', 20, true],
      ['10,20-25,30', 25, true],
      ['10,20-25,30', 26, false],
      ['10,20-25,30,36-36', 36, true],
      ['10,20-', 10, true],
      ['10,20-', 19, false],
      ['10,20-', 20, true],
      ['10,20-', 21, true],
      ['0,-20', 0, true],
      ['0,-20', 1, true],
      ['0,-20', 19, true],
      ['0,-20', 20, true],
      ['0,-20', 21, false],
      ['0,-20', 22, false],
      ['0,-20,40', 40, true],

      // errors
      ['abc', 12, false],
      [')#(\'$%)0', 0, false],
      [',,,', 12, 'exception'],
      ['10,', 12, 'exception'],
      ['10,,', 12, 'exception'],
      ['//', 0, 'exception'],
      ['/aaa/)#U($', 0, 'exception'],
      [',/,,/,)#,', 0, 'exception'],
      ['5-0', 5, false],
    ]

    for (const test in tests) {
      console.log('### test')
      const target_test = tests[test]
      console.log(target_test)

      try {
        let result = crontab.isMatchPart(target_test[0], target_test[1])
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
      let result = crontab.stringToObject(tests[i][0])
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
})
