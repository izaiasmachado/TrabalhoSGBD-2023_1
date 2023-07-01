class TreeNodeVisualizer {
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
}

class BTreeNodeVisualizer extends TreeNodeVisualizer {
  constructor(node) {
    super(node)
  }
}
