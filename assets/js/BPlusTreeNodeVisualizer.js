/**
 * Essa classe é reponsável por escutar os eventos do BPlusTreeNode e
 * atualizar a visualização da árvore.
 */
class BPlusTreeNodeVisualizer {
  constructor(node) {
    this.node = node
    this.init()
  }

  init() {
    this.createElement()
    this.node.subscribe(payload => this.listenerFunction(payload))
  }

  listenerFunction(event) {
    const eventQueue = EventQueue.getInstance()
    const bind = this.executeEvent.bind(this)
    event.callback = event => bind(event)
    eventQueue.enqueue(event)
  }

  executeEvent(event) {
    const { type, data } = event

    switch (type) {
      case 'insertKey':
        this.insertKey(data)
        break
      case 'deleteKey':
        this.deleteKey(data.key.value)
        break
      case 'replaceKey':
        this.replaceKey(data.oldKey.value, data.newKey.value)
        break
      case 'highlightKey':
        this.highlightKey(data.key.value)
        break
      case 'unhighlightKey':
        this.unhighlightKey(data.key.value)
        break
      default:
        break
    }
  }

  createElement() {
    this.element = document.createElement('div')
    this.element.classList.add('node')
    this.element.setAttribute('id', this.node.id)
    this.element.setAttribute('data-type', this.node.constructor.name)
  }

  insertKey(data) {
    const insertionIndex =
      data.key.index !== -1 ? data.key.index : this.node.keys.length - 1
    const keyElement = document.createElement('div')
    keyElement.classList.add('key')
    keyElement.setAttribute('data-key', data.key.value)
    keyElement.innerText = data.key.value
    this.element.insertBefore(keyElement, this.element.children[insertionIndex])
  }

  deleteKey(key) {
    const keyElement = this.element.querySelector(`[data-key="${key}"]`)
    if (!keyElement) return
    this.element.removeChild(keyElement)
  }

  replaceKey(oldKey, newKey) {
    const keyElement = this.element.querySelector(`[data-key="${oldKey}"]`)
    if (!keyElement) return
    keyElement.setAttribute('data-key', newKey)
    keyElement.innerText = newKey
  }

  highlightKey(key) {
    const keyElement = this.element.querySelector(`[data-key="${key}"]`)
    keyElement.classList.add('highlight')
  }

  unhighlightKey(key) {
    const keyElement = this.element.querySelector(`[data-key="${key}"]`)
    keyElement.classList.remove('highlight')
  }
}
