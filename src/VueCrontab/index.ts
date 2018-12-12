import install from './install'
import VueCrontabJob from './job/job'
import VueCrontabOption from './option'
import crontab from '../utils/crontab'

export default class VueCrontab {
  private jobs: Array<VueCrontabJob>
  private option: VueCrontabOption
  private interval_id: NodeJS.Timeout
  private state: Object

  /**
   * VueCrontab instance
   */
  private static _instance:VueCrontab

  /**
   * constructor
   * @param {Function} caller
   */
  constructor (caller:Function) {
    if (caller == VueCrontab.getInstance) {
      this.initialize()
    } else if (VueCrontab._instance)
      throw new Error('vuecrontab instance already created.')
    else
      throw new Error('instance create error.')
  }

  /**
   * initialize VueCrontab
   * @param {Object} [option={}]
   */
  public initialize(option: Object = {}): void {
    this.jobs = []
    this.state = {}
    this.interval_id = null
    this.state = {}
    this.setOption(option)
  }

  /**
   * set VueCrontab Option
   * @param {Object} option
   */
  public setOption(option: Object): void {
    this.option = new VueCrontabOption(option)
  }

  /**
   * get VueCrontab Option
   * @return {Object} VueCrontab option.
   */
  public getOption(): Object {
    return this.option
  }

  /**
   * start all jobs interval check.
   * @return {number} 1 = start success. 2 = already start. 0 = no job.
   */
  public startCrontab(): number {
    // check already start.
    if (this.interval_id !== null) {
      return 2
    }

    // check job length.
    if (this.jobs.length === 0) {
      return 0
    }

    // start
    let self = this
    this.interval_id = setInterval(function() {
      let now: Date = new Date()
      for (const job in self.jobs) {
        let target = self.jobs[job]
        let timer: String = target.getInterval()
        let func: Function = target.getJob()
        // console.log(timer)
        // console.log(func)

        // isMatch
        if (typeof(func) === 'function' && crontab.isMatch(timer, now)) {
          setTimeout(function() {
            const argument = target.getJobArguments()
            console.log(argument)
            target.setResult(now, func(argument))
          })
        }
      }
    }, this.option.getInterval())
    return 1
  }

  /**
   * stop all jobs interval check.
   */
  public stopCrontab(): void {
    clearInterval(this.interval_id)
  }

  /**
   * enable job.
   * @param {String} name
   * @return {Boolean}
   */
  public enableJob(name: String): Boolean {
    return true
  }

  /**
   * disable job.
   * @param {String} name
   * @return {Boolean}
   */
  public disableJob(name: String): Boolean {
    return true
  }

  /**
   * add job.
   * @param {Array<Object>|Object} config
   * @return {number} Number of registrations.
   */
  public addJob(config: Array<Object> | Object): number {
    console.log('VueCrontab addJob()')
    console.log(config)
    let count = 0

    if (Array.isArray(config)) {
      for (let i in config) {
        // validate
        if (VueCrontabJob.validate(config[i]) !== 1) {
          continue
        }

        // add
        this.jobs.push(new VueCrontabJob(config[i]))
        count++
      }
    } else if (typeof(config) === 'object') {
      // validate
      if (VueCrontabJob.validate(config) === 1) {
        // add
        this.jobs.push(new VueCrontabJob(config))
        count++
      }
    } else {
      return 0
    }

    if (this.jobs.length > 0 && this.option.auto_start) {
      this.startCrontab()
    }
    return count
  }

  /**
   * Check whether job name is duplicated.
   * @param {String} name job name.
   * @return {Boolean} 1
   */
  public isDuplicateJob(name: String): Boolean{
    // duplicate check.
    if (this.getJob(name) !== null) {
      return true
    }
    return false
  }

  /**
   * update job.
   * @param {String} name
   * @param {Array<Object>} config
   */
  public updateJob(name: String, config: Array<Object> | Object): Boolean {
    return true
  }

  /**
   * delete job.
   * @param {String} name
   */
  public deleteJob(name: String): Boolean {
    return true
  }

  /**
   * execute job.
   * @param {String} name
   */
  public execJob(name: String): Boolean {
    return true
  }

  /**
   * get job.
   * @param {String} name
   * @return {VueCrontabJob} null = can't find by name.
   */
  public getJob(name: String): VueCrontabJob {
    // console.log(name)
    // console.log(this.jobs)
    for (const job in this.jobs) {
      // console.log(job)
      if (this.jobs[job]['name'] === name) {
        // console.log(this.jobs[job])
        return this.jobs[job];
      }
    }
    return null
  }

  /**
   * get instance
   * @return {VueCrontab}
   */
  public static getInstance(): VueCrontab {
    if (!this._instance)
      this._instance = new VueCrontab(VueCrontab.getInstance)

    return this._instance
  }

  /**
   * Vue install
   */
  install = install
}
