class BPlusTreeVisualizer {
  constructor(tree) {
    this.tree = tree
    this.init()
    this.levels = []
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
      const levelElement = document.createElement('div')
      levelElement.classList.add('level')
      levelElement.setAttribute('data-level', index)

      const levelNumberElement = document.createElement('div')
      levelNumberElement.classList.add('level-number')
      levelNumberElement.innerText = index

      const levelNodesElement = document.createElement('div')
      levelNodesElement.classList.add('level-nodes')

      level.forEach(node => {
        const visualizer = this.nodeVisualizers[node.id]
        levelNodesElement.appendChild(visualizer.element)
      })

      levelElement.appendChild(levelNumberElement)
      levelElement.appendChild(levelNodesElement)
      this.element.appendChild(levelElement)
    })
  }
}
