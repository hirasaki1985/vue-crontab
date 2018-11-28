export default class VueCrontabOption {
  public timer: number

  constructor (option: any) {
    this.setOption(option)
  }

  setOption(option: any) {
    this.timer = option.timer
  }

  getTimer() {
    return this.timer
  }
}

