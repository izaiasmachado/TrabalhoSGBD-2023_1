class BaseNode extends Observable {
  constructor(fanout) {
    super()
    this.fanout = fanout
  }

  clone() {
    const clone = JSON.parse(JSON.stringify(this))
    return clone
  }
}
