/**
 * Class that records the execution result of VueCrontab.
 *
 */
export default class VueCrontabRecord {
  private results: Array<object>
  public max_rec_num: number

  /**
   * constructor with option.
   * @param {Object} option
   * @param {String} [options.max_rec_num=1] Maximum number of records to record execution results.
   */
  constructor (option: Object = {}) {
    this.initialize(option)
  }

  /**
   * initialize
   * @param {Object} option
   */
  initialize(option: Object = {}) {
    this.results = []
    this.max_rec_num = option['max_rec_num'] || 1
  }

  /**
   * Add the execution result of VueCrontab.
   * @param {Date} match_date execution time of VueCrontab.
   * @param {any} result result execution of VueCrontab.
   * @return {number} return new length of array.
   */
  addResult (match_date: Date, result: any): number {
    if (this.results.length >= this.max_rec_num) {
      this.deleteFirstResult()
    }
    return this.pushResult(match_date, result)
  }

  /**
   * Delete the first execution result.
   * @return {Object} delete execution.
   */
  private deleteFirstResult (): object {
    return this.results.shift()
  }

  /**
   *
   * @param {Date} match_date execution time of VueCrontab.
   * @param {any} result result execution of VueCrontab.
   * @return {number} return new length of array.
   */
  private pushResult (match_date: Date, result: any): number {
    const add_result = {
      match_date: match_date,
      result: result,
      finish_date: new Date()
    }
    return this.results.push(add_result)
  }

  /**
   * Return the execution latest result of crontab
   */
  getLastResult() {
    if (this.results.length === 0) {
      return {}
    }
    return this.results[this.results.length -1]
  }

  /**
   * Returns the execution result of crontab
   * @return Array<Object>
   */
  getResults(): Array<object> {
    return this.results
  }
}

