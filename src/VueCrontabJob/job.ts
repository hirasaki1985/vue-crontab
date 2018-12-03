import VueCrontabRecord from './record'

export default class VueCrontabJob {
  private setting: Object
  private record: VueCrontabRecord
  private state: Object
  private current: Object

  constructor(setting: Object = {}) {
    // console.log('VueCrontabJob()')
    // console.log(setting)
    this.setting = setting
    this.record = new VueCrontabRecord()
  }

  public getJob(): Function {
    // console.log('VueCrontabJob getJob()')
    return this.setting['job'] || null
  }

  public getInterval(): String {
    // console.log('VueCrontabJob getInterval()')
    return this.setting['interval'] || null
  }

  public setResult(result: any) {

  }

  public getLatestResult() {

  }

  public getRecord () {
    return this.record
  }
}
