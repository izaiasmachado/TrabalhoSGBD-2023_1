class OptionListener {
  constructor() {
    this.init()
    this.fanout = 4
    this.addEventListeners()
  }

  static getInstance() {
    if (!OptionListener.instance) {
      OptionListener.instance = new OptionListener()
    }

    return OptionListener.instance
  }

  init() {
    this.showFanout = document.getElementById('show-fanout')
    this.speedSelector = document.getElementById('tree-speed-selector')

    this.descreaseFanoutButton = document.getElementById(
      'decrease-fanout-button',
    )
    this.increaseFanoutButton = document.getElementById(
      'increase-fanout-button',
    )

    this.clearTreeButton = document.getElementById('clear-tree-button')
  }

  get fanout() {
    return Number(this.showFanout.textContent)
  }

  set fanout(fanout) {
    this.showFanout.textContent = fanout
  }

  addEventListeners() {
    this.increaseFanoutButton.addEventListener('click', e => {
      e.preventDefault()

      if (this.fanout === 10) return
      this.fanout = this.fanout + 1
      this.changeFanoutCallback(this.fanout)
    })

    this.descreaseFanoutButton.addEventListener('click', e => {
      e.preventDefault()

      if (this.fanout === 3) return
      this.fanout = this.fanout - 1
      this.changeFanoutCallback(this.fanout)
    })

    this.speedSelector.addEventListener('change', e => {
      e.preventDefault()

      const timeInterval = 1220 - Number(e.target.value)
      EventProcessor.getInstance().changeTimeInterval(timeInterval)
    })

    this.clearTreeButton.addEventListener('click', e => {
      e.preventDefault()
      this.clearTreeCallback()
    })
  }

  setChangeFanoutCallback(callback) {
    this.changeFanoutCallback = callback
    this.changeFanoutCallback(this.fanout)
  }

  setClearTreeCallback(callback) {
    this.clearTreeCallback = callback
  }
}
