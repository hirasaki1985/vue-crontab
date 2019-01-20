export default class VueCrontabOption {
  public interval: number
  public auto_start: Boolean

  constructor (option: Object = {}) {
    this.setOption(option)
  }

  /**
   * set VueCrontab option.
   * @param {Object} option
   */
  setOption(option: Object) {
    this.interval = option['interval'] !== undefined ? option['interval'] : 1000
    this.auto_start = option['auto_start'] !== undefined ? option['auto_start'] : true
  }

  /**
   * get interval time of check jobs
   * @return {number} interval time.
   */
  getInterval() {
    return this.interval
  }
}
