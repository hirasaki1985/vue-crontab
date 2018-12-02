import install from './install'
import VueCrontabJob from '../VueCrontabJob/job'
import VueCrontabOption from './option'

export default class VueCrontab {
  private jobs: Array<VueCrontabJob>
  private option: VueCrontabOption
  private interval_id: any
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
      throw new Error("vuecrontab instance already created.")
    else
      throw new Error("instance create error.")
  }

  /**
   * initialize VueCrontab
   */
  public initialize() {
    this.jobs = []
    this.state = {}
    this.option = new VueCrontabOption()
  }

  /**
   * set VueCrontab Option
   * @param Object option
   */
  public setOption(option: Object) {
    this.option = new VueCrontabOption(option)
  }

  public start() {
    let self = this
    self.interval_id = setInterval(function() {
      for (const job in self.jobs) {
        let one_config = self.jobs[job]
        let timer = one_config['timer'] || undefined
        if (typeof(timer) === 'function') {
          setTimeout(function() {
            timer()
          })
        }
      }
    }, self.option.getInterval())
  }

  public stop() {
    clearInterval(this.interval_id)
  }

  /**
   * add job
   * @param {Array<Object>|Object} config
   */
  public addJob(config: Array<Object> | Object) {
    console.log(config)
    Array.prototype.push.apply(this.jobs, config)
  }

  /**
   * get job
   * @param {String} name
   * @return {Object}
   */
  public getJob(name: String): Object {
    console.log(name)
    console.log(this.jobs)
    for (const job in this.jobs) {
      console.log(job)
      if (this.jobs[job]['name'] === name) {
        console.log(this.jobs[job])
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
