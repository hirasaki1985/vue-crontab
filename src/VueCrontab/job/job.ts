import VueCrontabRecord from '../record/record'
import Crontab from '../../utils/Crontab'

/**
 * Manage crontab job settings and execution results
 */
export default class VueCrontabJob {
  /**
   *  max_rec_num: Maximum number of records to record execution results.
   */
  private setting: Object
  private jobs: Array<Function>
  private intervals: Array<Object>
  private record: VueCrontabRecord

  /**
   *
   */
  private state: Object
  public counter: number
  public last_run: Date

  /**
   * constructor
   * @param {Object} setting
   * @param {number} [setting.max_rec_num=1] Maximum number of records to record execution results.
   */
  constructor(setting: Object = {}) {
    this.initialize(setting)
    this.set(setting)
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
    this.jobs = []
    this.intervals = []
  }

  /**
   * set Crontabjob
   * @param setting
   */
  private set(setting: Object) {
    // validate
    let validate_result = this.validate(setting)
    if (validate_result !== 1) return validate_result
    this.setJob(setting['job'])
    this.setInterval(setting['interval'])
  }

  public setJob(job: Array<Function> | Function): Boolean {
    // Array
    if (Array.isArray(job)) {
      this.jobs = this.jobs.concat(job)
      return true

    // function
    } else if (typeof(job) === 'function') {
      this.jobs.push(job)
      return true
    }
    return false
  }

  public setInterval(interval: Array<Object | String> | Object | String): Boolean {
    // Array
    if (Array.isArray(interval)) {
      for (let i in interval) {
        let target = interval[i]
        if (!Crontab.validateInterval(target)) return false
        this.intervals.push(Crontab.stringToObject(target))
      }
      // this.intervals = this.intervals.concat(interval)
      return true

    } else if (typeof(interval) === 'function') {
      if (!Crontab.validateInterval(interval)) return false
      this.intervals.push(Crontab.stringToObject(interval))
      return true
    }
    return false
  }

  /**
   * execute job.
   */
  public execute(date: Date) {

  }

  /**
   *
   */
  private isMatch(date: Date) {

  }


  /**
   * Check whether job setting is OK.
   * @param {Object} setting  job
   * @return {number} 1 = OK. -1 = name error. -2 = job error. -3 = interval error. -4 = emtpy.
   */
  public validate(setting: Object): number {
    if (Object.keys(setting).length === 0 && setting.constructor === Object) {
      return -4
    }

    // check name.
    let name = setting['name']
    if (typeof(name) !== 'string' || name === '') return -1

    // check jobs.
    if (!this.validateJobs(setting['job'])) return -2

    // check intervals.
    if (!this.validateIntervals(setting['interval'])) return -3

    return 1
  }

  private validateJobs(job: Array<Function> | Function): Boolean {
    if (typeof(job) !== 'undefined') {
      // multi jobs
      if (Array.isArray(job)) {
        if (job.length === 0) return false

        for (let i in job) {
          // validate
          if (typeof(job[i]) !== 'function')  return false
        }
      } else if (typeof(job) !== 'function') return false

      // single job
    } else {
      return false
    }
    return true
  }

  private validateIntervals(interval: Array<Object|String> | Object | String): Boolean {
    if (typeof(interval) !== 'undefined') {
      // multi intervals
      if (Array.isArray(interval)) {
        if (interval.length === 0)  return false
        for (let i in interval) {
          // validate
          if (typeof(interval[i]) !== 'function')  return false
          if (!Crontab.validateInterval(interval[i])) return false
        }

      // single interval
      } else {
        // validate
        if (typeof(interval) !== 'string' || interval === '') return false
        // if (!Crontab.validateInterval(interval)) return false
      }
    } else {
      return false
    }

    return true
  }

  /**
   * Return crontab job function.
   * @return {Function} crontab job function. if not setting return null.
   */
  public getJob(): Array<Function> {
    return this.jobs
  }

  /**
   * Return crontab interval.
   * @return {String} interval
   */
  public getInterval(): Array<Object> {
    return this.intervals
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
