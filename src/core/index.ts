import install from './install'
import VueCrontabConfig from './config'
import VueCrontabOption from './options'

export default class VueCrontab {
  private counter: number
  private configs: Array<VueCrontabConfig>
  private option: VueCrontabOption
  private interval_id: any

  /**
   *  インスタンス
   */
  private static _instance:VueCrontab

  /**
   * コンストラクタ
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
   * initialize
   */
  public initialize() {
    this.counter = 0
    this.configs = []
  }

  /**
   * set VueCrontab Option
   * @param Object option
   */
  public setCoreOption(option: Object) {
    this.option = new VueCrontabOption(option)
  }

  public start() {
    let self = this
    self.interval_id = setInterval(function() {
      for (const config in self.configs) {
        let one_config = self.configs[config]
        let timer = one_config['timer'] || undefined
        if (typeof(timer) === 'function') {
          setTimeout(function() {
            timer()
          })
        }
      }
    }, self.option.getTimer())
  }

  public stop() {
    clearInterval(this.interval_id)
  }

  /**
   * add config
   * @param Array<any> config
   */
  public addConfig(config: Array<any>) {
    console.log(config)
    Array.prototype.push.apply(this.configs, config)
  }

  /**
   * get config
   */
  public getConfig(name: String): any {
    console.log(name)
    console.log(this.configs)
    for (const config in this.configs) {
      console.log(config)
      if (this.configs[config]['name'] === name) {
        console.log(this.configs[config])
        return this.configs[config];
      }
    }
    return null;
  }

  /**
   * get instance
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
