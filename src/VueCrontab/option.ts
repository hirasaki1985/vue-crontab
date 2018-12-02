export default class VueCrontabOption {
  public interval: number

  constructor (option: Object = {}) {
    this.setOption(option)
  }

  setOption(option: any) {
    this.interval = option.interval | 1000
  }

  getInterval() {
    return this.interval
  }
}

