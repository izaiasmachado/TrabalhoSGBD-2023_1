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

  highlightNode() {
    this.element.classList.add('highlight')
    const duration = 600

    setTimeout(() => {
      this.element.classList.remove('highlight')
    }, duration)
  }

  /**
   * O ponto de conexão é o canto superior esquerdo do nó.
   */
  getPointerInPoint() {
    const rect = this.element.getBoundingClientRect()
    const x = rect.left
    const y = rect.top - rect.height / 2
    return { x, y }
  }

  /**
   * Retona um Y da parte mais baixa do nó.
   * Já o X, é calculado com base no ponteiro.
   * De modo que caso seja o primeiro ponteiro, o da esquerda.
   */
  getPointerOutPoint(pointer) {
    const rect = this.element.getBoundingClientRect()

    // Divide o tamanho do nó pela quantidade de ponteiros
    // para saber o tamanho de cada ponteiro
    const pointerWidth = rect.width / this.node.pointers.length

    // O X é calculado com base no ponteiro
    // De modo que caso seja o primeiro ponteiro, o da esquerda.
    // Savendo que ponter começa em 1
    const x = rect.left + pointerWidth * pointer
    const y = rect.bottom - rect.height / 2
    return { x, y }
  }
}
