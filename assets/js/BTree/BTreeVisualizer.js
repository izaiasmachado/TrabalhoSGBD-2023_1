class BTreeVisualizer {
  constructor(tree) {
    this.tree = tree
    this.levels = []
    this.nodeVisualizers = {}
    this.nodes = []
    this.init()
  }

  createRoot(data) {
    const { node } = data
    this.levels.unshift([node])
  }

  createNode(data) {
    const { node, leftNode, level } = data

    // Caso o nó seja o primeiro da árvore
    if (this.levels.length === level) {
      this.levels.push([node])
      return
    }

    const levelIndex = this.levels.findIndex(l => l.includes(leftNode))
    const nodeIndex = this.levels[levelIndex].findIndex(n => n === leftNode)

    this.levels[levelIndex].splice(nodeIndex + 1, 0, node)
  }

  /**
   * Reduz um nível da árvore ao remover o nó
   * que está na raíz.
   */
  deleteRoot(data) {
    const { node } = data
    this.levels.shift()
    delete this.nodeVisualizers[node.id]
  }

  deleteNode(data) {
    const { node, level } = data
    this.levels[level] = this.levels[level].filter(n => n !== node)
    delete this.nodeVisualizers[node.id]
  }

  createVisualizer(data) {
    const { node } = data
    const nodeVisualizer = new BPlusTreeNodeVisualizer(node)
    this.nodeVisualizers[node.id] = nodeVisualizer
  }

  highlightNode(data) {
    const { node } = data
    this.nodeVisualizers[node.id].highlightNode()
  }

  init() {
    this.createElement()
    const renderFixedScope = this.render.bind(this)
    createArrayObserver(this.levels, () => renderFixedScope())
    this.tree.subscribe(payload => this.listenerFunction(payload))
  }

  createElement() {
    this.element = document.querySelector('#tree')
  }

  listenerFunction(event) {
    // O evento de criação de um novo nó é tratado de forma diferente
    // não modifica a interface
    if (event.type === 'createdNewNode') {
      this.createVisualizer(event.data)
      return
    }

    const eventQueue = EventQueue.getInstance()
    const bind = this.executeEvent.bind(this)
    event.callback = event => bind(event)
    eventQueue.enqueue(event)
  }

  executeEvent(event) {
    const { type, data } = event

    switch (type) {
      case 'createRoot':
        this.createRoot(data)
        break
      case 'createNode':
        this.createNode(data)
        break
      case 'deleteRoot':
        this.deleteRoot(data)
        break
      case 'highlightNode':
        this.highlightNode(data)
        break
      case 'deleteNode':
        this.deleteNode(data)
      default:
        break
    }

    this.render()
  }

  render() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild)
    }

    this.levels.forEach((level, index) => {
      const nodeVisualizers = level.map(node => this.nodeVisualizers[node.id])
      const levelVisualizer = new LevelVisualizer(nodeVisualizers, index)
      levelVisualizer.setLevelNumber(index)
      levelVisualizer.render()
      this.element.appendChild(levelVisualizer.element)
    })
  }

  clear() {
    this.levels = []
    this.nodeVisualizers = {}
    this.render()
  }
}
