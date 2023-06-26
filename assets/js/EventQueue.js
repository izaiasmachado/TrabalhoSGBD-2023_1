/**
 * Fila de eventos em que cada evento possui um nome
 * e um função a ser executada.
 *
 * Classe deve ser um singleton, ou seja, deve ter apenas uma instância.
 */

class EventQueue {
  constructor() {
    this.queue = []
  }

  static getInstance() {
    if (!EventQueue.instance) {
      EventQueue.instance = new EventQueue()
    }
    return EventQueue.instance
  }

  enqueue(event) {
    this.queue.push(event)
  }

  dequeue() {
    return this.queue.shift()
  }

  isEmpty() {
    return this.queue.length === 0
  }
}
