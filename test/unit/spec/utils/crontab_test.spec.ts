import crontab from '../../../../src/utils/crontab'

describe('crontab test', () => {
  it('isMatchPart()', () => {
    // [part, time, result]
    const tests: Array<any> = [
      ['20', 20, true],
      ['20', 19, false],
      ['0,33', 0, true],
      ['29,55', 55, true],
      ['10,33', 0, false],
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

      // errors
      ['abc', 12, false],
      [')#(\'$%)0', 0, false],
      [',,,', 12, false],
      ['//', 0, false],
      ['/aaa/)#U($', 0, false],
      [',/,,/,)#,', 0, false],
    ]
    for (const test in tests) {
      console.log('-- test --')
      const target_test = tests[test]
      console.log(target_test)
      let result = crontab.isMatchPart(target_test[0], target_test[1])

      console.log(result)
      console.log()
      expect(result).toEqual(target_test[2])
    }
  })
})
