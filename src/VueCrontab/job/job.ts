import VueCrontabRecord from '../record/record'

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

  public getJobArguments(): Object {
    const last_result = this.record.getLastResult()
    return {
      last_run: this.record.last_run,
      counter: this.record.counter,
      last_result: last_result['result'] || null
    }
  }

  public setResult(match_date: Date, result: any) {
    this.record.addResult(match_date, result)
  }

  public getLatestResult() {

  }

  public getRecord () {
    return this.record
  }
}
