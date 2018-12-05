import VueCrontabRecord from '../record/record'

export default class VueCrontabJob {
  private setting: Object
  private record: VueCrontabRecord
  private state: Object
  private current: Object
  public counter: number
  public last_run: Date

  constructor(setting: Object = {}) {
    // console.log('VueCrontabJob()')
    // console.log(setting)
    this.initialize(setting)
  }

  public initialize(setting: Object) {
    this.setting = setting
    this.record = new VueCrontabRecord()
    this.counter = 0
    this.last_run = null
  }

  public getJob(): Function {
    // console.log('VueCrontabJob getJob()')
    return this.setting['job'] || null
  }

  public getInterval(): String {
    // console.log('VueCrontabJob getInterval()')
    return this.setting['interval'] || null
  }

  public getJobArguments(): Object {
    const last_result = this.record.getLastResult()
    return {
      last_run: this.last_run,
      counter: this.counter,
      last_result: last_result['result'] || null
    }
  }

  public setResult(match_date: Date, result: any) {
    this.last_run = match_date
    this.record.addResult(match_date, result)
  }

  public getLatestResult() {
    return this.record.getLastResult()
  }

  public getRecord () {
    return this.record
  }
}
