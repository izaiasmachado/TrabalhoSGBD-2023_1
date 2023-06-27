/**
 * Periodicamente verifica se a fila de eventos está vazia, se não estiver,
 * pega o primeiro evento da fila e executa a função callback.
 */

class EventProcessor {
  constructor() {
    this.eventQueue = EventQueue.getInstance()
    this.init()
  }

  static getInstance() {
    if (!EventProcessor.instance) {
      EventProcessor.instance = new EventProcessor()
    }
    return EventProcessor.instance
  }

  init() {
    this.interval = setInterval(() => {
      if (!this.eventQueue.isEmpty()) {
        const event = this.eventQueue.dequeue()
        event.callback(event)
      }
    }, 610)
  }
}
