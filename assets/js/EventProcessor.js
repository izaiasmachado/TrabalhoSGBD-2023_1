/**
 * Periodicamente verifica se a fila de eventos está vazia, se não estiver,
 * pega o primeiro evento da fila e executa a função callback.
 */

class EventProcessor {
  constructor() {
    this.eventQueue = EventQueue.getInstance()
    this.timeInterval = 610
    this.start()
  }

  static getInstance() {
    if (!EventProcessor.instance) {
      EventProcessor.instance = new EventProcessor()
    }
    return EventProcessor.instance
  }

  start() {
    this.interval = setInterval(() => {
      if (this.eventQueue.isEmpty()) {
        BottomBar.getInstance().stopTimer()
        return
      }
      const event = this.eventQueue.dequeue()
      this.handleEvent(event)
      event.callback(event)
    }, this.timeInterval)
  }

  stop() {
    clearInterval(this.interval)
  }

  changeTimeInterval(timeInterval) {
    this.timeInterval = timeInterval
    this.stop()
    this.start()
  }

  handleEvent(event) {
    const bottomBar = BottomBar.getInstance()

    switch (event.type) {
      case 'highlightNode':
        bottomBar.increaseReadNodes()
        break
      case 'insertKey':
        bottomBar.increaseWrittenNodes()
        break
      case 'deleteKey':
        bottomBar.increaseWrittenNodes()
        break
      default:
        break
    }
  }
}
