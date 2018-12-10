import VueCrontabRecord from '../record/record'

/**
 * Manage crontab job settings and execution results
 */
export default class VueCrontabJob {
  private setting: Object
  private record: VueCrontabRecord
  private state: Object
  public counter: number
  public last_run: Date

  /**
   * constructor
   * @param {Object} setting
   * @param {number} [setting.max_rec_num=1] Maximum number of records to record execution results.
   */
  constructor(setting: Object = {}) {
    // console.log('VueCrontabJob()')
    // console.log(setting)
    this.initialize(setting)
  }

  /**
   * Initialize VueCrontabJob setting.
   * @param {Object} setting
   */
  public initialize(setting: Object = {}) {
    this.setting = setting
    this.record = new VueCrontabRecord(setting)
    this.counter = 0
    this.last_run = null
    this.state = {}
  }

  /**
   * Return crontab job function.
   * @return {Function} crontab job function. if not setting return null.
   */
  public getJob(): Function {
    // console.log('VueCrontabJob getJob()')
    return this.setting['job'] || null
  }

  /**
   * Return crontab interval.
   * @return {String} interval
   */
  public getInterval(): String {
    // console.log('VueCrontabJob getInterval()')
    return this.setting['interval'] || null
  }

  public getSetting(): Object {
    return this.setting
  }

  /**
   * Return arguments at job execution.
   * @return {Object} arguments
   */
  public getJobArguments(): Object {
    const last_result = this.record.getLastResult()
    return {
      last_run: this.last_run,
      counter: this.counter,
      last_result: last_result['result']
    }
  }

  /**
   * Add execution result.
   * @param {Date} match_date
   * @param {any} result execution result(job function return).
   * @param {Date} finish_date Time when job ended
   */
  public setResult(match_date: Date, result: any, finish_date: Date = new Date()) {
    this.last_run = match_date
    this.counter++
    this.record.addResult(match_date, result, finish_date)
  }

  /**
   * Return latest execution result.
   * @return {Object} last result.
   */
  public getLatestResult() {
    return this.record.getLastResult()
  }
}
