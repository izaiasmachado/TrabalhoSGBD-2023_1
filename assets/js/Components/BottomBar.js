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
    this.nosLidosElement = document.getElementById(
      'bottom-bar-read-nodes-value',
    )
    this.timerElement = document.getElementById('bottom-bar-timer-value')
    this.nosEscritosElement = document.getElementById(
      'bottom-bar-written-nodes-value',
    )
    this.hide()
  }

  reset() {
    this.stopTimer()
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
    this.reset()
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
    this.timerElement.innerHTML = `${tempo} ms`
  }

  setNosLidos(nosLidos) {
    this.nosLidosElement.innerHTML = nosLidos
  }

  setNosEscritos(nosEscritos) {
    this.nosEscritosElement.innerHTML = nosEscritos
  }

  increaseReadNodes() {
    const nosLidos = parseInt(this.nosLidosElement.innerHTML) + 1
    this.setNosLidos(nosLidos)
  }

  increaseWrittenNodes() {
    const nosEscritos = parseInt(this.nosEscritosElement.innerHTML) + 1
    this.setNosEscritos(nosEscritos)
  }
}
