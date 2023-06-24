class BPlusTreeVisualizer {
  constructor(tree) {
    this.tree = tree
    this.init()
  }

  createNode(fanout, isLeaf) {
    const createdNode = isLeaf ? new LeafNode(fanout) : new InternalNode(fanout)
    const nodeVisualizer = new BPlusTreeNodeVisualizer(createdNode)
    const container = document.getElementById('container')
    container.appendChild(nodeVisualizer.element)
    return createdNode
  }

  init() {
    this.createElement()
    this.tree.setCreateNodeFunction(this.createNode)
    this.tree.subscribe(payload => this.listenerFunction(payload))
  }

  createElement() {
    this.element = document.createElement('div')
    this.element.classList.add('tree')
    const container = document.querySelector('#container')
    container.appendChild(this.element)
  }

  // listenerFunction(payload) {
  //   const { type, data } = payload
  // }
}
