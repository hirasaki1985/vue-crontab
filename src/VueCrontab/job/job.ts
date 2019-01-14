import VueCrontabRecord from '../record/record'
import Crontab from '../../utils/Crontab'

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
    this.last_run = null
    this.state = {
      status: Number(setting['status']) || 1,
      execution: 0
    }
    this.jobs = []
    this.intervals = []
  }

  /**
   * set Crontabjob
   * @param setting
   * @throws {format errors}
   */
  private reflectSetting(setting: Object) {
    // validate
    let validate_result = this.validate(setting)

    // catch error.
    if (validate_result !== 1) {
      switch (validate_result) {
        case -1:
          throw new Error('name format error.')
        case -2:
          throw new Error('job format error.')
        case -3:
          throw new Error('interval format error.')
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
    }
  }

  /**
   * add job.
   * @param job
   * @return add count.
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
   * @param interval
   * @return add count. -1 = error.
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
   * execute job.
   * @param {Date} date check date.
   * @return {number} 1 = run, 0 = date not match interval, -1 = stop job execution.
   */
  public async execute(date: Date): Promise<any> {
    console.log('job execute()')
    this.last_check = date

    // check state
    if (this.state['status'] !== 1) {
      return -1
    }

    // check intervals
    for (let i in this.intervals) {
      let interval = this.intervals[i]

      // not match
      if (!Crontab.isMatch(interval, date)) {
        return 0
      }
    }
    let result = await this.run(date)
    return result
  }

  public manualExecute(): Promise<any> {
    return this.run(new Date(), 'manual')
  }

  /**
   * run job s
   * @param {Date} date
   */
  private async run(date: Date = new Date(), type: String = 'cron'): Promise<any> {
    console.log('job run()')
    // execute jobs
    let self = this
    this.last_run = date

    for (let j in this.jobs) {
      let num = Number(j)
      let arg = this.getJobArguments(num)
      let exec_job = this.jobs[j]
      console.log('one job execution.')
      console.log(num)
      console.log(arg)
      console.log(exec_job)

      function syncExecution(): Promise<any> {
        return new Promise((resolve, reject) => {
          setTimeout(async function() {
            console.log('setTimeout()')
            let result = await exec_job(arg)
            console.log(date)
            console.log(result)
            console.log(num)
            let set_result = self.setResult(num, date, result, type)
            console.log(set_result)
            resolve()
          }, 0)
        })
      }

      let result = await syncExecution()
    }
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

  /**
   * job validation
   * @param {Array<Function> | Function} job
   * @return {Boolean} true = ok, false = ng.
   */
  private validateJobs(job: Array<Function> | Function): Boolean {
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
  private validateIntervals(interval: Array<Object|String> | Object | String): Boolean {
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
   * Return arguments at job execution.
   * @param {number} num this.record index
   * @return {Object} arguments
   */
  private getJobArguments(num: number = 0): Object {
    if (0 <= num && num < this.record.length) {
      const last_result = this.record[num].getLastResult()
      return {
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
}
