class BTree extends Observable {
  constructor(fanout) {
    super()
    this.fanout = fanout
    this.root = null
    this.createNodeFunction = this.defaultCreateNodeFunction
  }

  defaultCreateNodeFunction(fanout, isLeaf) {
    const createdNode = new BTreeNode(fanout, isLeaf)
    this.notifyAll({
      type: 'createdNewNode',
      data: {
        node: createdNode,
      },
    })
    return createdNode
  }

  setCreateNodeFunction(createNodeFunction) {
    this.createNodeFunction = createNodeFunction
  }

  getNodeLevel(node) {
    if (node === null) return 0

    let root = this.root
    let level = 0

    while (!root.leaf) {
      const rootPointerIndex = root.pointers.findIndex(p => p === node)

      if (rootPointerIndex !== -1) return level + 1

      root = root.pointers.find(p =>
        isLowerOrEqual(p.mostRightKey(), node.mostLeftKey()),
      )

      level++
    }

    return level
  }

  isEmpty() {
    return this.root === null
  }

  insertParent() {}
  insert(value, pointer) {}
  find(value) {}
  delete(value, pointer) {}
}
