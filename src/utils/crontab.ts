/**
 *
 * @param interval {String}
 * @param datetime {Date}
 * @returns {Boolean}
 */
export default {
  isMatch: function(interval: String, check_date: Date): Boolean {
    // validate
    if (this.validateInterval(interval)) return false

    const interval_sep: Array<string> = interval.split(' ')
    const time_sep: Array<number> = [
      check_date.getSeconds(), check_date.getMinutes(), check_date.getDay(), check_date.getMonth(), check_date.getFullYear()
    ]
    for (const part in interval_sep) {
      const part_str = interval_sep[part]
      const time_num = time_sep[part]
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
    if (comma_sep.length > 1) {
      // console.log(comma_sep)
      for (const comma_part in comma_sep) {
        // validate
        if (comma_sep[comma_part] === '') continue

        // slash
        const slash_sep: Array<String> = comma_sep[comma_part].split('/')
        if (slash_sep.length > 1) {
          const slash_num: number = Number(slash_sep[1])
          if (isMatchSlash(slash_num, time)) return true
        }

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
    const slash_sep: Array<String> = part.split('/')
    if (slash_sep.length > 1) {
      // console.log(slash_sep)
      const slash_num: number = Number(slash_sep[1])
      return isMatchSlash(slash_num, time)
    }

    if (Number(part) === time) return true
    return false

    function isMatchSlash(s_num: number, time: number): Boolean {
      // console.log('isMatchSlash()')
      // console.log(s_num)
      // console.log(time)
      // console.log(time % s_num)
      if (isNaN(s_num) || isNaN(time) || s_num === 0) return false
      if (time % s_num === 0) return true
      return false
    }
  }
}
