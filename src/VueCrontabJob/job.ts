import VueCrontabRecord from './record'

export default class VueCrontabJob {
  private setting: Object
  private record: VueCrontabRecord
  private state: Object
  private current: Object

  constructor(setting = {}) {
    this.setting = setting
    this.record = new VueCrontabRecord()
  }

  public getRecord () {
    return this.record
  }
}
