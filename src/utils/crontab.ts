export default class Crontab {
  /** keys of interval setting. */
  private static interval_keys = ['milliseconds', 'seconds', 'minutes', 'hours', 'day', 'month', 'year', 'week']

  /** milliseconds is in 0.1 second increments. */
  private static milliseconds_increments = 100

  /**
   * Convert format of crontab written in string to Object format.
   * @param {String} crontab_str [milliseconds] [seconds] [minutes] [hours] [day] [month] [year] [week of the day]
   * @return {Object} object format.
   *  {
   *    milliseconds: [milliseconds],
   *    seconds: [seconds],
   *    minutes: [minutes],
   *    hours: [hours],
   *    day: [day],
   *    month: [month],
   *    year: [year],
   *    week: [week of the day]
   *  }
   */
  public static stringToObject(crontab_str: String): Object {
    let result = {}
    const crontab_sep = crontab_str.split(' ')

    for(let i in this.interval_keys) {
      const key = this.interval_keys[i]
      const value = crontab_sep[i] !== undefined ? crontab_sep[i] : '*'
      result[key] = value
    }
    return result
  }

  /**
   * Converts date and time type to Object format.
   * month is incrementing by 1. milliseconds is in 0.1 second increments.
   * @param {Date} date convert date.
   * @return {Object} date object.
   */
  public static convertDateToObject(date: Date): Object {
    return {
      milliseconds: Math.floor(date.getMilliseconds() / this.milliseconds_increments),
      seconds: date.getSeconds(),
      minutes: date.getMinutes(),
      hours:   date.getHours(),
      day:     date.getDate(),
      month:   date.getMonth() + 1,
      year:    date.getFullYear(),
      week:    date.getDay()
    }
  }

  /**
   * Check whether interval setting of crontab matches specified date and time.
   * @param {String|Object} interval crontab format string or object
   *   [milliseconds] [seconds] [minutes] [hours] [day] [month] [year] [week of the day]
   * @param {Date} check_date Date and time of comparison
   * @return {number} 1 = match, 0 = not match, -1 = format error.
   */
  public static isMatch(interval: String|Object, check_date: Date): number {
    // console.log('crontab.ts isMatch()')
    // validate
    // if (!this.validateInterval(interval)) return -1

    const time_sep: Array<number> = [
      // check_date.getMilliseconds(),
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

    if (typeof(interval) === 'string') {
      const interval_sep: Array<string> = interval.split(' ')

      for (const part in interval_sep) {
        // console.log('### part')
        const part_str = interval_sep[part]
        const time_num = time_sep[part]
        // console.log(part_str)
        // console.log(time_num)
        if (this.isMatchPart(part_str, time_num) !== 1) {
          return 0
        }
      }
      return 1
    } else if (typeof(interval) === 'object') {

    }
    return -99
  }

  /**
   *
   * @param {String} interval
   */
  public static validateInterval(interval: String): Boolean {
    return true
  }

  /**
   * Make sure to match one item on crontab.
   * @param {String} part one item on crontab.
   * @param {number} time Part of the date or time to be compared.
   * @return {number} 1 = match, 0 = not match, -1 = format error.
   */
  public static isMatchPart(part: String, time: number): number {
    if (part === '*') {
      return 1
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
        if (testSlash(comma_sep[comma_part])) return 1

        // hyphen
        if (testHyphen(comma_sep[comma_part])) return 1

        // number
        const comma_num: number = Number(comma_sep[comma_part])
        if (isNaN(comma_num)) continue
        if (comma_num === time) {
          return 1
        }
      }
      return 0
    }

    // slash
    if (testSlash(part)) return 1

    // hyphen
    if (testHyphen(part)) return 1

    // number
    if (Number(part) === time) return 1
    return 0

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
