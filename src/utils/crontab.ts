/**
 *
 * @param interval {String}
 * @param datetime {Date}
 * @returns {Boolean}
 */
export default {
  /**
   * Convert format of crontab written in string to Object format.
   * @param {String} crontab_str [milliseconds] [seconds] [minutes] [hours] [day] [month] [year] [week of the day]
   * @return {Object} object format.
   *  {
   *    milliseconds, [milliseconds],
   *    seconds, [seconds],
   *    minutes, [minutes],
   *    hours, [hours],
   *    day, [day],
   *    month, [month],
   *    year, [year],
   *    week, [week of the day]
   *  }
   */
  stringToObject: function(crontab_str: String): Object {
    let result = {}
    const crontab_sep = crontab_str.split(' ')
    const keys = ['milliseconds', 'seconds', 'minutes', 'hours', 'day', 'month', 'year', 'week']

    for(let i in keys) {
      const key = keys[i]
      const value = crontab_sep[i] !== undefined ? crontab_sep[i] : '*'
      result[key] = value
    }
    return result
  },

  isMatch: function(interval: String, check_date: Date): Boolean {
    // console.log('crontab.ts isMatch()')
    // validate
    if (!this.validateInterval(interval)) return false

    const interval_sep: Array<string> = interval.split(' ')
    const time_sep: Array<number> = [
      check_date.getSeconds(),
      check_date.getMinutes(),
      check_date.getHours(),
      check_date.getDate(),
      check_date.getMonth() + 1,
      check_date.getFullYear(),
      check_date.getDay()
    ]
    // console.log(interval_sep)
    // console.log(time_sep)

    for (const part in interval_sep) {
      // console.log('### part')
      const part_str = interval_sep[part]
      const time_num = time_sep[part]
      // console.log(part_str)
      // console.log(time_num)
      if (!this.isMatchPart(part_str, time_num)) {
        return false
      }
    }
    return true
  },

  /**
   *
   * @param interval {String}
   */
  validateInterval: function(interval: String): Boolean {
    return true
  },

  /**
   *
   * @param part {String}
   * @param time {number}
   */
  isMatchPart: function(part: String, time: number): Boolean {
    if (part === '*') {
      return true
    }

    // comma
    const comma_sep: Array<String> = part.split(',')
    // console.log(comma_sep)
    if (comma_sep.length > 1) {
      // console.log(comma_sep.indexOf('') )
      if (comma_sep.indexOf('') >= 0 ) {
        throw new Error('comma format error.')
      }

      // console.log(comma_sep)
      for (const comma_part in comma_sep) {
        // slash
        if (testSlash(comma_sep[comma_part])) return true

        // hyphen
        if (testHyphen(comma_sep[comma_part])) return true

        // number
        const comma_num: number = Number(comma_sep[comma_part])
        if (isNaN(comma_num)) continue
        if (comma_num === time) {
          return true
        }
      }
      return false
    }

    // slash
    if (testSlash(part)) return true

    // hyphen
    if (testHyphen(part)) return true

    // number
    if (Number(part) === time) return true
    return false

    function testSlash(part: String): Boolean {
      const slash_sep: Array<String> = part.split('/')
      if (slash_sep.length === 2) {
        // console.log(slash_sep)
        const slash_num: number = Number(slash_sep[1])
        return isMatchSlash(slash_num, time)

      } else if (slash_sep.length > 2) {
        throw new Error('slash format error.')
      }
    }

    function isMatchSlash(s_num: number, time: number): Boolean {
      // console.log('isMatchSlash()')
      // console.log(s_num)
      // console.log(time)
      // console.log(time % s_num)
      if (isNaN(s_num) || isNaN(time) || s_num === 0) return false
      if (time % s_num === 0) return true
      return false
    }

    function testHyphen(part: String): Boolean {
      const hyphen_sep: Array<String> = part.split('-')
      // console.log('testHyphen')
      // console.log(hyphen_sep)
      if (hyphen_sep.length === 2) {
        const before: number = hyphen_sep[0] === '' ? null :  Number(hyphen_sep[0])
        const after: number = hyphen_sep[1] === '' ? null :  Number(hyphen_sep[1])
        return isMatchHyphen(before, after, time)

      } else if (hyphen_sep.length > 2) {
        throw new Error('jyphen format error.')
      }
      return false
    }

    function isMatchHyphen(before: number, after: number, time: number): Boolean {
      // console.log('isMatchHyphen')
      // console.log(before)
      // console.log(after)
      // console.log(time)

      if ((isNaN(before) || before === null) && time <= after) return true
      if ((isNaN(after) || after === null) && time >= before) return true
      if ((isNaN(before) || before === null) && (isNaN(after) || after === null)) return false
      if (before <= time &&  time <= after) return true
      return false
    }
  }
}
