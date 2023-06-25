/**
 * Reponsável por mostrar um único level da árvore.
 * Caso o level seja modificado, então o level é atualizado.
 */
class LevelVisualizer {
  constructor(levelNodes = [], levelNumber = 0) {
    this.levelNodes = levelNodes
    this.init()
    this.setLevelNumber(levelNumber)
  }

  init() {
    this.createElement()
    const updateLevelNodesFixedScope = this.updateLevelNodes.bind(this)
    createArrayObserver(this.levelNodes, () => updateLevelNodesFixedScope())
  }

  setLevelNumber(levelNumber) {
    this.levelNumber = levelNumber
    this.levelNumberElement.innerText = this.levelNumber
  }

  updateLevelNodes() {
    this.levelNodes.forEach(node => {
      this.levelNodesElement.appendChild(node.element)
    })

    this.render()
  }

  createElement() {
    this.element = document.createElement('div')
    this.element.classList.add('level')

    this.levelNumberElement = document.createElement('div')
    this.levelNumberElement.classList.add('level-number')
    this.levelNumberElement.innerText = this.levelNumber

    this.levelNodesElement = document.createElement('div')
    this.levelNodesElement.classList.add('level-nodes')

    this.updateLevelNodes()

    this.element.appendChild(this.levelNumberElement)
    this.element.appendChild(this.levelNodesElement)
  }

  render() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild)
    }

    this.element.appendChild(this.levelNumberElement)
    this.element.appendChild(this.levelNodesElement)
  }
}

class BPlusTreeVisualizer {
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

    if (level === this.levels.length) {
      this.levels.push([node])
    }

    const levelIndex = this.levels.findIndex(l => l.includes(leftNode))
    const nodeIndex = this.levels[levelIndex].findIndex(n => n === leftNode)

    this.levels[levelIndex].splice(nodeIndex + 1, 0, node)
  }

  createVisualizer(data) {
    const { node } = data
    const nodeVisualizer = new BPlusTreeNodeVisualizer(node)
    this.nodeVisualizers[node.id] = nodeVisualizer
  }

  init() {
    this.createElement()
    const renderFixedScope = this.render.bind(this)
    createArrayObserver(this.levels, () => renderFixedScope())
    this.tree.subscribe(payload => this.listenerFunction(payload))
  }

  createElement() {
    this.element = document.createElement('div')
    this.element.classList.add('tree')
    const container = document.querySelector('#container')
    container.appendChild(this.element)
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
}
