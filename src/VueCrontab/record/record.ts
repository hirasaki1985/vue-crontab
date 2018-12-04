export default class VueCrontabRecord {
  public counter: number
  private results: Array<object>
  public last_run: Date

  constructor () {
    this.counter = 0
    this.results = []
    this.last_run = null
  }

  addResult (match_date: Date, result: Object): Boolean {
    const add_result = {
      match_date: match_date,
      result: result,
      finish_date: new Date()
    }
    this.results.push(add_result)
    this.counter++
    this.last_run = match_date
    return true
  }

  getLastResult() {
    if (this.results.length === 0) {
      return {}
    }
    return this.results[this.results.length -1]
  }
}

