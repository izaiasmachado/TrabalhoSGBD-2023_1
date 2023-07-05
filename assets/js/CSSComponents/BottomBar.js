class BottomBar {
  constructor() {
    this.init()
  }

  static getInstance() {
    if (!BottomBar.instance) {
      BottomBar.instance = new BottomBar()
    }
    return BottomBar.instance
  }

  init() {
    this.element = document.getElementById('bottom-controlls-bar')
    this.hide()
  }

  reset() {
    this.setTempo(0)
    this.setNosLidos(0)
    this.setNosEscritos(0)
  }

  show() {
    this.element.style.display = 'flex'
    this.reset()
  }

  hide() {
    this.element.style.display = 'none'
    this.reset()
  }

  startTimer() {
    this.startTime = new Date()

    this.timerInterval = setInterval(() => {
      const now = new Date()
      const timeMiliseconds = now.getTime() - this.startTime.getTime()
      this.setTempo(timeMiliseconds)
    }, 10)
  }

  stopTimer() {
    clearInterval(this.timerInterval)
  }

  setTempo(tempo) {
    const timer = document.getElementById('bottom-bar-timer-value')
    timer.innerHTML = `${tempo} ms`
  }

  setNosLidos(nosLidos) {
    const nosLidosElement = document.getElementById(
      'bottom-bar-read-nodes-value',
    )
    nosLidosElement.innerHTML = nosLidos
  }

  setNosEscritos(nosEscritos) {
    const nosEscritosElement = document.getElementById(
      'bottom-bar-written-nodes-value',
    )
    nosEscritosElement.innerHTML = nosEscritos
  }
}
