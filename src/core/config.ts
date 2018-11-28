import VueCrontabRecord from './record'

export default class HirasakiNpmConfig {
  private options: Object
  private record: VueCrontabRecord

  constructor(options = {}) {
    this.options = options
    this.record = new VueCrontabRecord()
  }

  public getRecord () {
    return this.record
  }
}

