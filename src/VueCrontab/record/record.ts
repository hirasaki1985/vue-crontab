/**
 * Class that records the execution result of VueCrontab.
 */
export default class VueCrontabRecord {
  /**
   * An array that stores the execution result.
   * Array object {
   *   match_date: {Date} execution time of VueCrontab.
   *   result: {any} result execution of VueCrontab.
   *   finish_date: {Date} Time when job ended
   * }
   */
  private results: Array<object>
  public max_rec_num: number
  public counter: number

  /**
   * constructor with option.
   * @param {Object} option
   * @param {number} [options.max_rec_num=1] Maximum number of records to record execution results.
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
    this.counter = 0
  }

  /**
   * Add the execution result of VueCrontab.
   * @param {Date} match_date execution time of VueCrontab.
   * @param {any} result result execution of VueCrontab.
   * @param {Date} finish_date Time when job ended
   * @return {number} return new length of array.
   */
  addResult (match_date: Date, result: any, type:String = 'cron', finish_date: Date = new Date()): number {
    if (this.results.length >= this.max_rec_num) {
      this.deleteFirstResult()
    }
    this.counter++
    const add_result = {
      match_date: match_date,
      result: result,
      type: type,
      finish_date: finish_date
    }
    return this.results.push(add_result)
  }

  /**
   * Delete the first execution result.
   * @return {Object} delete execution.
   */
  private deleteFirstResult (): object {
    if (this.results.length === 0) return {}
    return this.results.shift()
  }

  /**
   * Return the execution latest result of crontab
   * @return {Object} last result.
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
