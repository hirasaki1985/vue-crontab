import crontab from '../../../../src/utils/crontab'

describe('crontab test', () => {
  it('isMatchPart()', () => {
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
      console.log('-- test --')
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
})
