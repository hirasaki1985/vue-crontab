import install from './install'
import VueCrontabJob from './job'
import VueCrontabOption from './option'

export default class VueCrontab {
  /**
   * vue crontab option.
   * @param {Boolean} [option.auto_start=true] true = auto start when job add. false = not start.
   * @param {number}  [option.interval=1000] timing of jobs interval check.
   */
  private option: VueCrontabOption
  private jobs: Object
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
    this.jobs = {}
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
    if (Object.keys(this.jobs).length=== 0) {
      return 0
    }

    // Adjust the value of millesconds in the vicinity of 050
    let milleseconds: number = 0
    do {
      let date: Date = new Date()
      milleseconds = date.getMilliseconds()
    } while (!(40 <= milleseconds && milleseconds <= 60))

    // start
    let self = this
    this.interval_id = setInterval(function() {
      let now: Date = new Date()
      for (const job in self.jobs) {
        let target_job = self.jobs[job]
        target_job.execute(now)
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
   * @param {string} name
   * @return {Boolean}
   */
  public enableJob(name: string): Boolean {
    if (this.getJob(name) !== null) {
      this.jobs[name].start()
      return true
    }
    return false
  }

  /**
   * disable job.
   * @param {string} name
   * @return {Boolean}
   */
  public disableJob(name: string): Boolean {
    if (this.getJob(name) !== null) {
      this.jobs[name].stop()
      return true
    }
    return false
  }

  /**
   * add job.
   * @param {Array<Object>|Object} config
   * @return {number} Number of registrations.
   */
  public addJob(config: Array<Object> | Object): number {
    console.log('VueCrontab addJob()')
    let count = 0

    // format of array
    if (Array.isArray(config)) {
      for (let i in config) {
        let target = config[i]

        // validate
        let validate_result = VueCrontabJob.validate(target)
        console.log(validate_result)
        if (validate_result === 1) {
          let name = target['name']
          if (this.isDuplicateJob(name)) continue
          // add
          let obj = new VueCrontabJob(target)
          this.jobs[name] = obj
          count++
        }
      }

    // format of object
    } else if (typeof(config) === 'object') {
      // validate
      let validate_result = VueCrontabJob.validate(config)
      if (validate_result === 1) {
        let name = config['name']
        if (this.isDuplicateJob(name)) return 0

        // add
        let obj = new VueCrontabJob(config)
        this.jobs[name] = obj
        count = 1
      }
    } else {
      return 0
    }

    if (Object.keys(this.jobs).length > 0 && this.option.auto_start) {
      this.startCrontab()
    }
    return count
  }

  /**
   * Check whether job name is duplicated.
   * @param {string} name job name.
   * @return {Boolean} true = duplicate, false = not duplicate.
   */
  public isDuplicateJob(name: string): Boolean {
    // duplicate check.
    if (this.getJob(name) !== null) {
      return true
    }
    return false
  }

  /**
   * delete job.
   * @param {string} name
   */
  public deleteJob(name: string): Boolean {
    if (this.getJob(name) !== null) {
      delete this.jobs[name]

      // stop CVrontab if job length is 0.
      if (Object.keys(this.jobs).length === 0) {
        this.stopCrontab()
      }

      return true
    }
    return false
  }

  /**
   * Run the job manually.
   * @param {string} name
   * @return {Object} {
   *    {number} code: 1 = run. -2 = no job.
   *    {Date}   date: execute date.
   *  }
   */
  public async execJob(name: string): Promise<any> {
    const now = new Date()
    if (this.getJob(name) !== null) {
      let result = await this.jobs[name].manualExecute()
      return result
    }
    return {
      code: -2,
      date: now
    }
  }

  /**
   * get job.
   * @param {string} name
   * @return {VueCrontabJob} null = can't find by name.
   */
  public getJob(name: string): VueCrontabJob {
    return this.jobs[name] || null
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
