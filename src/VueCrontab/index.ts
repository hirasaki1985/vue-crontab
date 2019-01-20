import install from './install'
import VueCrontabJob from './job/job'
import VueCrontabOption from './option'
import Crontab from '../utils/Crontab'

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

    // start
    let self = this
    this.interval_id = setInterval(function() {
      let now: Date = new Date()
      for (const job in self.jobs) {
        // console.log('VueCrontab startCrontab() job execute')
        let target_job = self.jobs[job]
        // console.log(target_job)
        target_job.execute(now)
        /*
        let target = self.jobs[job]
        let timer: String = target.getInterval()
        let func: Function = target.getJob()
        // console.log(timer)
        // console.log(func)

        // isMatch
        if (typeof(func) === 'function' && Crontab.isMatch(timer, now)) {
          setTimeout(function() {
            const argument = target.getJobArguments()
            console.log(argument)
            target.setResult(now, func(argument))
          })
        }
        */
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
    console.log(config)
    let count = 0

    // format of array
    if (Array.isArray(config)) {
      for (let i in config) {
        let target = config[i]

        // validate
        let validate_result = VueCrontabJob.validate(target)
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
        return 1
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
  public isDuplicateJob(name: string): Boolean{
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
      return true
    }
    return false
  }

  /**
   * execute job.
   * @param {string} name
   */
  public execJob(name: string): Boolean {
    if (this.getJob(name) !== null) {
      this.jobs[name].manualExecute()
      return true
    }
    return false
  }

  /**
   * get job.
   * @param {string} name
   * @return {VueCrontabJob} null = can't find by name.
   */
  public getJob(name: string): VueCrontabJob {
    // console.log(name)
    // console.log(this.jobs)
    /*
    for (const job in this.jobs) {
      // console.log(job)
      if (this.jobs[job]['name'] === name) {
        // console.log(this.jobs[job])
        return this.jobs[job];
      }
    }
    */
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
