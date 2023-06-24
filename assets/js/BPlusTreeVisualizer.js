/**
 * Reponsável por mostrar um único level da árvore.
 * Caso o level seja modificado, então o level é atualizado.
 */
class LevelVisualizer {
  constructor(levelNodes = []) {
    this.levelNodes = levelNodes
    this.levelNumber = 0
    this.init()
  }

  setLevelNumber(levelNumber) {
    this.levelNumber = levelNumber
  }

  init() {
    this.createElement()
    const updateLevelNodesFixedScope = this.updateLevelNodes.bind(this)
    createArrayObserver(this.levelNodes, () => updateLevelNodesFixedScope())
  }

  updateLevelNodes() {
    this.levelNodes.forEach(node => {
      this.levelNodesElement.appendChild(node.element)
    })
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
    this.init()
    this.nodeVisualizers = {}
  }

  createRoot(data) {
    const { node } = data
    this.levels.unshift([node])
    this.render()
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

  listenerFunction(payload) {
    const { type, data } = payload

    switch (type) {
      case 'createdNewNode':
        this.createVisualizer(data)
        break
      case 'createRoot':
        this.createRoot(data)
        break
      default:
        break
    }
  }

  render() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild)
    }

    this.levels.forEach((level, index) => {
      const nodeVisualizers = level.map(node => this.nodeVisualizers[node.id])
      const levelVisualizer = new LevelVisualizer(nodeVisualizers)
      levelVisualizer.setLevelNumber(index)
      levelVisualizer.render()
      this.element.appendChild(levelVisualizer.element)
    })
  }
}
