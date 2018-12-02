export default class VueCrontabRecord {
  private counter: number
  private results: Array<any>
  private last_run: Date

  constructor () {
    this.counter = 0
    this.results = []
    this.last_run = null
  }

  getRecord () {
    return {
      counter: this.counter,
      result: this.results[this.results.length - 1]
    }
  }
}

