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

  listenerFunction(payload) {
    const { type, data } = payload

    switch (type) {
      case 'insertKey':
        this.insertKey(data)
        break
      case 'deleteKey':
        this.deleteKey(data.key.value)
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
    this.element.removeChild(keyElement)
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
