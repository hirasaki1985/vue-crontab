import install from './install'
import VueCrontabJob from '../VueCrontabJob/job'
import VueCrontabOption from './option'
import crontab from '../utils/crontab'

export default class VueCrontab {
  private jobs: Array<VueCrontabJob>
  private option: VueCrontabOption
  private interval_id: NodeJS.Timeout
  private state: Object

  /**
   *  VueCrontab instance
   */
  private static _instance:VueCrontab

  /**
   * constructor
   * @param caller
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
   */
  public initialize(option: Object = {}) {
    this.jobs = []
    this.state = {}
    this.interval_id = null
    this.state = {}
    this.setOption(option)
  }

  /**
   * set VueCrontab Option
   * @param Object option
   */
  public setOption(option: Object) {
    this.option = new VueCrontabOption(option)
  }

  public start(): Boolean {
    console.log('VueCrontab start()')
    if (this.interval_id !== null) {
      return false
    }

    let self = this
    self.interval_id = setInterval(function() {
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
            target.setResult(func())
          })
        }
      }
    }, self.option.getInterval())
    return true
  }

  public stop(): Boolean {
    clearInterval(this.interval_id)
    return true
  }

  /**
   * add job
   * @param {Array<Object>|Object} config
   */
  public addJob(config: Array<Object> | Object): Boolean {
    console.log('VueCrontab addJob()')
    console.log(config)
    // Array.prototype.push.apply(this.jobs, new VueCrontabJob(config))

    if (Array.isArray(config)) {
      for (let i in config) {
        this.jobs.push(new VueCrontabJob(config[i]))
      }
    } else if (typeof(config) === 'object') {
      this.jobs.push(new VueCrontabJob(config))
    } else {
      return false
    }

    if (this.jobs.length > 0 && this.option.auto_start) {
      // console.log('auto start')
      this.start()
    }
    return true
  }

  /**
   * get job
   * @param {String} name
   * @return {VueCrontabJob}
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
    return null;
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
