import VueCrontabRecord from './record'
import Crontab from '../utils/Crontab'

/**
 * Manage crontab job settings and execution results
 */
export default class VueCrontabJob {
  /**
   * Store arguments passed when instantiated.
   * @param {String} [setting.name] (required) job name.
   * @param {Array<String|Object>|String|Object} [setting.interval] (required) interval.
   * @param {Array<Function>|Function} [setting.job] (required) job.
   * @param {number} [setting.max_rec_num=1] Maximum number of records to record execution results.
   * @param {number} [setting.status=0] 1 = can execute job. 0 = cannot execute job.
   * @param {number} [setting.sync=0] 1 = sync job execution(use promise). 0 = not sync job execution
   * @param {Array<Function>|Function} [setting.condition] Additional execution conditions
   */
  private setting: Object

  /**
   * Manage status.
   * @param {Number} [state.status=1] 1 = can execute job. 0 = cannot execute job.
   * @param {Number} [state.execution] 1 = running. 0 = waiting.
   */
  private state: Object

  private jobs: Array<Function>
  private intervals: Array<Object>
  private conditions: Array<Function>
  private record: Array<VueCrontabRecord>
  public counter: number
  public last_check: Date
  public last_run: Date

  /**
   * constructor
   * @param {Object} setting equal private setting: Object.
   * @throws {format errors}
   */
  constructor(setting: Object = {}) {
    this.initialize(setting)
    this.reflectSetting(setting)
  }

  /**
   * Initialize VueCrontabJob setting.
   * @param {Object} setting
   */
  public initialize(setting: Object = {}) {
    this.setting = setting
    this.record = []
    this.counter = 0
    this.last_check = null
    this.last_run = undefined
    this.state = {
      status: Number(setting['status']) || 1,
      execution: 0,
      sync: Number(setting['sync']) || 0,
    }
    this.jobs = []
    this.intervals = []
    this.conditions = []
  }

  /**
   * set Crontabjob
   * @param setting
   * @throws {format errors}
   */
  private reflectSetting(setting: Object) {
    // validate
    let validate_result = VueCrontabJob.validate(setting)

    // catch error.
    if (validate_result !== 1) {
      switch (validate_result) {
        case -1:
          throw new Error('name format error.')
        case -2:
          throw new Error('job format error.')
        case -3:
          throw new Error('interval format error.')
        case -5:
          throw new Error('condition format error.')
        default:
          throw new Error('unexpected error.')
      }

    // add job, interval
    } else {
      if (this.addJob(setting['job'], setting) === -1) {
        throw new Error('add job error.')
      }
      if (this.addInterval(setting['interval']) === -1) {
        throw new Error('add interval error.')
      }
      if (setting['condition'] && this.addCondition(setting['condition']) === -1) {
        throw new Error('add condition error.')
      }
    }
  }

  /**
   * add job.
   * @param {Array<Function>|Function} job
   * @return {number} add count. -1 = error.
   */
  public addJob(job: Array<Function> | Function, setting: Object): number {
    // Array
    if (Array.isArray(job)) {
      // this.jobs = this.jobs.concat(job)
      for (let i in job) {
        this.jobs.push(job[i])
        this.record.push(new VueCrontabRecord(setting))
      }
      return job.length

    // function
    } else if (typeof(job) === 'function') {
      this.jobs.push(job)
      this.record.push(new VueCrontabRecord(setting))
      return 1
    }
    return -1
  }

  /**
   * add interval.
   * @param {Array<Object | String> | Object | String} interval
   * @return {number} add count. -1 = error.
   */
  public addInterval(interval: Array<Object | String> | Object | String): number {
    const types = ['string', 'object']
    // Array
    if (Array.isArray(interval)) {
      for (let i in interval) {
        let target = interval[i]
        if (!Crontab.validateInterval(target)) return -1
        let add = Crontab.fillUnsetDefaultValue(Crontab.stringToObject(target))
        this.intervals.push(add)
      }
      // this.intervals = this.intervals.concat(interval)
      return interval.length

    // string or object
    } else if (types.indexOf(typeof(interval)) >= 0) {
      if (!Crontab.validateInterval(interval)) return -1
      let add = Crontab.fillUnsetDefaultValue(Crontab.stringToObject(interval))
      this.intervals.push(add)
      return 1

    } else {
      return -1
    }
  }

  /**
   * add condition.
   * @param {Array<Function>|Function} condition
   * @return {number} add count. -1 = error.
   */
  public addCondition(condition: Array<Function> | Function): number {
    // Array
    if (Array.isArray(condition)) {
      for (let i in condition) {
        this.conditions.push(condition[i])
      }
      return condition.length

    // function
    } else if (typeof(condition) === 'function') {
      this.conditions.push(condition)
      return 1
    }
    return -1
  }

  /**
   * execute job.
   * @param {Date} date check date.
   * @return {Object}
   *  {
   *    {number} code: 1 = run, 0 = date not match interval, -1 = stop job execution, -2 = condition is not true.
   *    {Date}   date: execute date.
   *  }
   */
  public async execute(date: Date): Promise<any> {
    this.last_check = date
    let code = 1

    // check state
    if (this.state['status'] !== 1) {
      code = -1
    } else {
      // check intervals
      for (let i in this.intervals) {
        let interval = this.intervals[i]

        // not match
        if (!Crontab.isMatch(interval, date)) {
          code = 0
          break
        }
      }
      // check conditions
      for (let j in this.conditions) {
        let condition = this.conditions[j]

        // not true
        if (!condition()) {
          code = -2
          break
        }
      }
      if (code === 1)
        code = await this.run(date)
    }
    return {
      code: code,
      date: date
    }
  }

  /**
   * manual execute.
   * @return {Object} {
   *    {number} code: 1 = run.
   *    {Date}   date: execute date.
   *  }
   */
  public async manualExecute(): Promise<any> {
    const now = new Date()
    let result = await this.run(now, 'manual')
    return {
      code: result,
      date: now
    }
  }

  /**
   * run job.
   * @param {Date} date
   * @param {String} type
   * @return {number} code: 1 = run, 0 = date not match interval, -1 = stop job execution.
   */
  private async run(date: Date = new Date(), type: String = 'cron'): Promise<any> {
    // execute jobs
    let self = this
    let j = null
    let num = null
    let arg = null

    for (j in this.jobs) {
      try {
        num = Number(j)
        arg = this.getJobArguments(num, date)

        function syncExecution(): Promise<any> {
          return new Promise((resolve, reject) => {
            setTimeout(async function() {
              let result = await self.jobs[j](arg)
              let set_result = self.setResult(num, date, result, type)
              resolve()
            }, 0)
          }).catch((error) => console.error(error))
        }

        if (self.setting['sync'] === 1) {
          await syncExecution()
        } else {
          syncExecution()
        }
      } catch(e) {
        console.error(e)
      }
    }

    // update last run
    this.last_run = date
    return 1
  }

  /**
   * Make the job executable.
   */
  public start() {
    this.state['status'] = 1
  }

  /**
   * Make the job not executable.
   */
  public stop() {
    this.state['status'] = 0
  }

  /**
   * Check whether job setting is OK.
   * @param {Object} setting  job
   * @return {number} 1 = OK. -1 = name error. -2 = job error. -3 = interval error. -4 = emtpy. -5 = condition error.
   */
  public static validate(setting: Object): number {
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

    // check condition.
    if (setting['condition'] && !this.validateCondition(setting['condition'])) return -5

    return 1
  }

  /**
   * job validation
   * @param {Array<Function> | Function} job
   * @return {Boolean} true = ok, false = ng.
   */
  private static validateJobs(job: Array<Function> | Function): Boolean {
    const types = ['function']
    if (typeof(job) !== 'undefined') {
      // multi jobs
      if (Array.isArray(job)) {
        if (job.length === 0) return false

        for (let i in job) {
          // validate
          if (types.indexOf(typeof(job[i])) === -1) return false
        }
      // single job
      } else if (types.indexOf(typeof(job)) === -1) return false
    } else {
      return false
    }
    return true
  }

  /**
   * job validation
   * @param {Array<Object|String> | Object | String} job
   * @return {Boolean} true = ok, false = ng.
   */
  private static validateIntervals(interval: Array<Object|String> | Object | String): Boolean {
    const types = ['string', 'object']

    // not undefined
    if (typeof(interval) !== 'undefined') {
      // multi intervals
      if (Array.isArray(interval)) {
        if (interval.length === 0)  return false
        for (let i in interval) {
          // validate
          if (types.indexOf(typeof(interval[i])) === -1) return false
          if (!Crontab.validateInterval(interval[i])) return false
        }

      // single interval
      } else {
        // validate
        if (types.indexOf(typeof(interval)) === -1) return false
        if (!Crontab.validateInterval(interval)) return false
      }

      return true

    // undefined
    } else {
      return false
    }
  }

  /**
   * condition validation
   * @param {Array<Function>|Function} condition
   * @return {Boolean} true = ok, false = ng.
   */
  private static validateCondition(condition: Array<Function>|Function): Boolean {
    const types = ['function']
    if (typeof(condition) !== 'undefined') {
      // multi jobs
      if (Array.isArray(condition)) {
        if (condition.length === 0) return true

        for (let i in condition) {
          // validate
          if (types.indexOf(typeof(condition[i])) === -1) return false
        }
      // single job
      } else if (types.indexOf(typeof(condition)) === -1) return false
    }
    return true
  }

  /**
   * Return arguments at job execution.
   * @param {number} num this.record index
   * @param {Date} date execution date and time.
   * @return {Object} arguments
   */
  private getJobArguments(num: number = 0, date: Date): Object {
    if (0 <= num && num < this.record.length) {
      const last_result = this.record[num].getLastResult()
      return {
        exec_date: date,
        last_run: this.last_run,
        counter: this.record[num].counter,
        last_result: last_result['result'],
        type: last_result['type']
      }
    }
    return {}
  }

  /**
   * Add execution result.
   * @param {number} num this.record index
   * @param {Date} match_date
   * @param {any} result execution result(job function return).
   * @param {String} type crontab or manual
   * @param {Date} finish_date Time when job ended
   * @return {Boolean} true = success. false = failed.
   */
  private setResult(num: number, match_date: Date, result: any, type:String = 'cron', finish_date: Date = new Date()): Boolean {
    if (0 <= num && num < this.record.length) {
      this.last_run = match_date
      this.counter++
      this.record[num].addResult(match_date, result, type, finish_date)
      return true
    }
    return false
  }

  /**
   * Return latest execution result.
   * @param {number} num this.record index
   * @return {Object} last result.
   */
  public getLatestResult(num: number = 0): Object {
    if (0 <= num && num < this.record.length) {
      return this.record[num].getLastResult()
    }
    return {}
  }

  /**
   * return state of job.
   * @return Object this.state
   */
  public getState() {
    return this.state
  }
}
