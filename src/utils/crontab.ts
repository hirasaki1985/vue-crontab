export default class Crontab {
  /** keys of interval setting. */
  private static settings = [
    { name: 'milliseconds',
      validate: {start: 0, end: 9},
      default: '0'},
    { name: 'seconds',
      validate: {start: 0, end: 59},
      default: '*'},
    { name: 'minutes',
      validate: {start: 0, end: 59},
      default: '*'},
    { name: 'hours',
      validate: {start: 0, end: 23},
      default: '*'},
    { name: 'day',
      validate: {start: 0, end: 31},
      default: '*'},
    { name: 'month',
      validate: {start: 1, end: 12},
      default: '*'},
    { name: 'year',
      validate: {start: 0},
      default: '*'},
    { name: 'week',
      validate: {start: 0, end: 6},
      default: '*'}
  ]

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

    for (let i in this.settings) {
      const key = this.settings[i]['name']
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
   * Fill in the unset points with the default value.
   * @param {Object} interval
   * @return {Object}
   */
  public static fillUnsetDefaultValue(interval: Object) {
    let obj = Object.assign({}, interval);
    for (let i in this.settings) {
      let key = this.settings[i]['name']
      obj[key] = interval[key] === undefined ? this.settings[i]['default'] : interval[key]
    }
    return obj
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
   * Make sure to match one item on crontab.
   * @param {String} part one item on crontab.
   * @param {number} time Part of the date or time to be compared.
   * @return {number} 1 = match, 0 = not match, -1 = format error.
   */
  public static isMatchPart(part: String, time: number): number {
    if (part === '*') {
      return 1
    }

    // comma separate array
    const comma_sep: Array<String> = part.split(',')

    if (comma_sep.length > 1) {
      if (comma_sep.indexOf('') >= 0 ) {
        throw new Error('comma format error.')
      }

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

    /** test slash */
    function testSlash(part: String): Boolean {
      const slash_sep: Array<String> = part.split('/')
      if (slash_sep.length === 2) {
        const slash_num: number = Number(slash_sep[1])
        return isMatchSlash(slash_num, time)

      } else if (slash_sep.length > 2) {
        throw new Error('slash format error.')
      }
    }

    /** Check the time matches the setting of slash. */
    function isMatchSlash(s_num: number, time: number): Boolean {
      if (isNaN(s_num) || isNaN(time) || s_num === 0) return false
      if (time % s_num === 0) return true
      return false
    }

    /** test hyphen */
    function testHyphen(part: String): Boolean {
      const hyphen_sep: Array<String> = part.split('-')
      if (hyphen_sep.length === 2) {
        const before: number = hyphen_sep[0] === '' ? null :  Number(hyphen_sep[0])
        const after: number = hyphen_sep[1] === '' ? null :  Number(hyphen_sep[1])
        return isMatchHyphen(before, after, time)

      } else if (hyphen_sep.length > 2) {
        throw new Error('hyphen format error.')
      }
      return false
    }

    /** Check the time matches the setting of hyphen. */
    function isMatchHyphen(before: number, after: number, time: number): Boolean {
      if ((isNaN(before) || before === null) && time <= after) return true
      if ((isNaN(after) || after === null) && time >= before) return true
      if ((isNaN(before) || before === null) && (isNaN(after) || after === null)) return false
      if (before <= time &&  time <= after) return true
      return false
    }
  }

  /**
   * check crontab format.
   * @param {String|Object} interval crontab format string or object.
   * @return {Boolean} true = ok, false - ng.
   */
  public static validateInterval(interval: String | Object): Boolean {
    // console.log('Crontab validateInterval()')
    let check_obj :Object = null
    if (typeof(interval) === 'string') {
      check_obj = this.stringToObject(interval)
    } else {
      check_obj = interval
    }
    check_obj = this.fillUnsetDefaultValue(check_obj)
    // console.log(check_obj)

    for (let i in this.settings) {
      let interval_name = this.settings[i]['name']
      let target = check_obj[interval_name]
      let result = this.validateIntervalPart(target, this.settings[i]['validate'])
      if (!result) {
        return false
      }
    }
    return true
  }

  /**
   * check format one item on crontab.
   * @param {String} part item on crontab.
   * @param {Object} validate validate rules.
   * @return {Boolean} true = ok, false = ng.
   */
  public static validateIntervalPart(part: String, validate: Object = {}): Boolean {
    if (part === '') {
      return false
    }

    // comma separate array
    const comma_sep: Array<String> = part.split(',')

    // multi
    if (comma_sep.length > 1) {
      for (let i in comma_sep) {
        let target = comma_sep[i]
        if (!check(target, validate)) {
          return false
        }
      }

    // single
    } else {
      if (!check(part, validate)) {
        return false
      }
    }

    return true

    /** check format. @return {Boolean} true = ok, false = ng. */
    function check(chk_str: String, rule: Object = {}):Boolean {
      if (chk_str === '*') return true
      let slash_result = checkSlash(chk_str)
      if ( slash_result !== 0) {
        return slash_result === 1 ? true : false
      }
      let hyphen_result = checkHyphen(chk_str, rule)
      if ( hyphen_result !== 0) {
        return hyphen_result === 1 ? true : false
      }
      if (!checkNum(chk_str)) return false
      return checkRange(chk_str, rule)
    }

    /** check slash format. @return 0 = don't check, 1 = ok, -1 = ng. */
    function checkSlash(chk_str: String): number {
      const slash_sep: Array<String> = chk_str.split('/')

      if (slash_sep.length === 1) return 0
      if (slash_sep.length >= 3) return -1
      if (slash_sep[0] !== '') return -1
      if (isNaN(Number(slash_sep[1]))) return -1
      return 1
    }

    /** check hyphen format. @return 0 = don't check, 1 = ok, -1 = ng. */
    function checkHyphen(chk_str: String, rule: Object = {}): number {
      const hyphen_sep: Array<String> = chk_str.split('-')
      if (hyphen_sep.length === 1) return 0
      if (hyphen_sep.length >= 3) return -1

      let start = Number(hyphen_sep[0])
      let end = Number(hyphen_sep[1])
      if (hyphen_sep[0] === '') {
        if (isNaN(end)) return -1
        return checkRange(hyphen_sep[1], rule) ? 1 : -1

      } else if (hyphen_sep[1] === '') {
        if (isNaN(start)) return -1
        return checkRange(hyphen_sep[0], rule) ? 1 : -1

      } else {
        if (isNaN(start) || isNaN(end)) return -1
        if (!checkRange(hyphen_sep[0], rule)) return -1
        if (!checkRange(hyphen_sep[1], rule)) return -1
        if (start > end) return -1
      }
      // if (checkNum(start) && chkeckNum(end)) return true
      return 1
    }

    /** check number format. @return true = ok, false = ng. */
    function checkNum(chk_num: String): Boolean {
      if (chk_num === '') return false
      if (isNaN(Number(chk_num))) return false
      return true
    }

    function checkRange(chk_num: String, validate: Object = {}): Boolean {
      let num: Number = Number(chk_num)
      // start <= num <= end
      if (typeof(validate['start']) !== 'undefined' && typeof(validate['end']) !== 'undefined') {
        if (validate['start'] <= num && num <= validate['end']) return true
        return false

      // start <= num
      } else if (typeof(validate['start']) !== 'undefined') {
        if (validate['start'] <= num) return true
        return false

      // num <= end
      } else if (typeof(validate['end']) !== 'undefined') {
        if (num <= validate['end']) return true
        return false
      }

      return true
    }
  }
}
