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
      ['5-0', 5, false],

      // errors
      ['abc', 12, 'exception'],
      [')#(\'$%)0', 0, 'exception'],
      [',,,', 12, 'exception'],
      ['10,', 12, 'exception'],
      ['10,,', 12, 'exception'],
      ['//', 0, 'exception'],
      ['/aaa/)#U($', 0, 'exception'],
      [',/,,/,)#,', 0, 'exception'],
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

  // fillUnsetDefaultValue
  it('fillUnsetDefaultValue()', () => {
    console.log('## fillUnsetDefaultValue test')

    // {milliseconds: 0, seconds: '*', minutes: '*', hours: '*', day: '*', month: '*', year: '*', week: '*'}
    const tests: Array<any> = [
      [{milliseconds: '2'}, {milliseconds: '2', seconds: '*', minutes: '*', hours: '*', day: '*', month: '*', year: '*', week: '*'}],
      [{seconds: '/5'}, {milliseconds: '0', seconds: '/5', minutes: '*', hours: '*', day: '*', month: '*', year: '*', week: '*'}],
      [{minutes: '3'}, {milliseconds: '0', seconds: '*', minutes: '3', hours: '*', day: '*', month: '*', year: '*', week: '*'}],
      [{hours: '10'}, {milliseconds: '0', seconds: '*', minutes: '*', hours: '10', day: '*', month: '*', year: '*', week: '*'}],
      [{day: '13'}, {milliseconds: '0', seconds: '*', minutes: '*', hours: '*', day: '13', month: '*', year: '*', week: '*'}],
      [{month: '4'}, {milliseconds: '0', seconds: '*', minutes: '*', hours: '*', day: '*', month: '4', year: '*', week: '*'}],
      [{year: '2015'}, {milliseconds: '0', seconds: '*', minutes: '*', hours: '*', day: '*', month: '*', year: '2015', week: '*'}],
      [{week: '1,2'}, {milliseconds: '0', seconds: '*', minutes: '*', hours: '*', day: '*', month: '*', year: '*', week: '1,2'}],
      [{seconds: '0-30', minutes: '/10'}, {milliseconds: '0', seconds: '0-30', minutes: '/10', hours: '*', day: '*', month: '*', year: '*', week: '*'}],
    ]

    for (let i in tests) {
      let test = tests[i]
      let result = Crontab.fillUnsetDefaultValue(test[0])
      console.log(test)
      console.log(result)

      for (let j in result) {
        expect(result[j]).toEqual(test[1][j])
      }
      console.log()
    }
  })

  // validateIntervalPart
  it('validateIntervalPart()', () => {
    console.log('## validateIntervalPart test')

    // [part, time, result]
    const tests: Array<any> = [
      // number
      ['*', true],
      ['0', true],
      ['1    ', true],
      ['20', true],
      ['10000', true],
      ['aaaa', false],
      ['!&', false],
      ['|{`{`', false],
      ['0x2222', true],

      // slash
      ['/20', true],
      ['/*', false],
      ['/aaa', false],
      ['10/20', false],
      ['10/aaa', false],
      ['bbb/aaa', false],
      ['/1000', true],
      ['/1000    ', true],
      ['/    1000', true],
      ['//', false],
      ['/12/34', false],
      ['/    12/34', false],

      // hyphen
      ['1-2', true],
      ['0-100', true],
      ['900-1000', true],
      ['-40', true],
      ['*-40', false],
      ['900-', true],
      ['900-*', false],
      ['*-*', false],
      ['aaa-1000', false],
      ['0-aaa', false],
      ['aaa-1000', false],
      ['10-bcx', false],
      ['abd-afdf', false],
      ['aaa-', false],
      ['-aaa', false],
      ['10-5', false],

      // comma
      ['1,2', true],
      ['1,2,3,4,5,6,7,8,9,10', true],
      ['1,2,,3', false],
      ['1,5-10,33', true],
      ['/3,10-20', true],
      ['/3,aa-bb', false],
      ['aa-bb,222', false],
      ['/aa,234', false],
      ['1,2,3,4,5,6,a', false]
    ]

    for (const test in tests) {
      console.log('### test')
      const target_test = tests[test]
      console.log(target_test)

      let result = Crontab.validateIntervalPart(target_test[0])
      expect(result).toEqual(target_test[1])
      console.log(result)
      console.log()
    }
  })

  // validateInterval
  it('validateIntervalPart() with validate setting', () => {
    console.log('## validateIntervalPart() with validate setting')

    // [part, time, result]
    const tests: Array<any> = [
      ['0', {start: 10, end: 20}, false],
      ['9', {start: 10, end: 20}, false],
      ['10', {start: 10, end: 20}, true],
      ['11', {start: 10, end: 20}, true],
      ['15', {start: 10, end: 20}, true],
      ['19', {start: 10, end: 20}, true],
      ['20', {start: 10, end: 20}, true],
      ['21', {start: 10, end: 20}, false],
      ['50', {start: 10, end: 20}, false],
    ]

    for (const test in tests) {
      console.log('### validateIntervalPart() with validate setting')
      const target_test = tests[test]
      console.log(target_test)

      let result = Crontab.validateIntervalPart(target_test[0], target_test[1])
      expect(result).toEqual(target_test[2])
      console.log(result)
      console.log()
    }
  })

  // validateInterval
  it('validateInterval()', () => {
    console.log('## validateInterval test')

    // [part, time, result]
    const tests: Array<any> = [
      // string
      ['1', true],
      ['1 2', true],
      ['1 2 3 4 5 6 7 0', true],
      ['0 1-10 4', true],
      ['0 * * 1-10', true],
      ['0 * /5 * *', true],
      ['1,2,3,4,5 6,7,8,9,0 0-10,11-25,50 /4 1', true],
      ['* * * * * * * 0', true],

      ['a', false],
      ['* * * * * * * a-z', false],
      ['* 0,1,2,3,4,5,a', false],
      ['* * * 9-0', false],

      // out of range
      ['9', true],
      ['10', false],
      ['11', false],
      ['0 59', true],
      ['0 60', false],
      ['0 * 59', true],
      ['0 * 60', false],
      ['0 * * 23', true],
      ['0 * * 24', false],
      ['0 * * * 31', true],
      ['0 * * * 32', false],
      ['0 * * * * 0', false],
      ['0 * * * * 1', true],
      ['0 * * * * 12', true],
      ['0 * * * * 13', false],
      ['0 * * * * * * 6', true],
      ['0 * * * * * * 7', false],
      ['0-100', false],
      ['0 60-', false],
      ['0 * -60', false],
      ['0 * * 24', false],
      ['0 * * * 0-32', false],
      ['0 * * * * 0-', false],
      ['0 * * * * * * -7', false],

      // object
      [{milliseconds: '5'}, true],
      [{seconds: '/10'}, true],
      [{minutes: '/5'}, true],
      [{hours: '/3'}, true],
      [{day: '1,2,3,4,5'}, true],
      [{month: '4-7'}, true],
      [{year: '2018'}, true],
      [{week: '1'}, true],
      [{seconds: '30-40', minutes: '/5'}, true],
      [{hours: '1-10', minutes: '0'}, true],
      [{month: '1', day: '1', hours: '5-6', minutes: '0'}, true],

      [{milliseconds: '0-9'}, true],
      [{seconds: 'a'}, false],
      [{minutes: '0-a'}, false],
      [{hours: 'b-'}, false],
      [{day: '/aaa'}, false],
      [{month: '-r-'}, false],
      [{year: '"#$%&'}, false],
      [{week: '/333,1,2,3,4,a'}, false],
      [{hours: '1', day: 'a'}, false],
      [{minutes: '0,30', hours: '0-5', week: 'a'}, false],
      [{second: 'aa', month: 'bb'}, false],
    ]

    for (const test in tests) {
      console.log('### validateInterval test')
      const target_test = tests[test]
      console.log(target_test)

      let result = Crontab.validateInterval(target_test[0])
      expect(result).toEqual(target_test[1])
      console.log(result)
      console.log()
    }
  })
})
