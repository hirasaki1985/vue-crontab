export default class VueCrontabOption {
  public interval: number
  public auto_start: Boolean

  constructor (option: Object = {}) {
    this.setOption(option)
  }

  setOption(option: any) {
    this.interval = option.interval || 1000
    this.auto_start = option.auto_start || true
  }

  getInterval() {
    return this.interval
  }
}
