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

  findSupposedLeafNode(value) {
    let node = this.root

    while (!node.leaf) {
      const keyIndex = node.keys.findIndex(key => isLower(value, key))

      this.notifyAll({
        type: 'highlightNode',
        data: {
          node: node,
        },
      })

      if (keyIndex === -1) {
        node = node.lastNonNullPointer()
      } else if (value === node.keys[keyIndex]) {
        node = node.pointers[keyIndex + 1]
      } else {
        node = node.pointers[keyIndex]
      }
    }

    this.notifyAll({
      type: 'highlightNode',
      data: {
        node: node,
      },
    })

    return node
  }

  parent(node) {
    const findParent = (currentNode, targetNode) => {
      if (
        currentNode === null ||
        currentNode === undefined ||
        targetNode === null ||
        targetNode === undefined
      ) {
        return null
      }

      if (!currentNode.pointers || currentNode.leaf) return null

      const isNodeInPointers = currentNode.pointers.some(pointer => {
        return pointer.id === targetNode.id
      })

      if (isNodeInPointers) return currentNode

      for (const pointer of currentNode.pointers) {
        const parent = findParent(pointer, targetNode)
        if (parent !== null) {
          return parent
        }
      }

      return null
    }

    return findParent(this.root, node)
  }

  insertParent(node, newKey, newNode) {
    if (this.root == node) {
      const newRoot = this.createNodeFunction(this.fanout, false)

      this.notifyAll({
        type: 'createRoot',
        data: {
          node: newRoot,
        },
      })

      node.delete(newKey)
      newRoot.insert(newKey, node)
      newRoot.pointers.push(newNode)
      this.root = newRoot
      return
    }

    const parent = this.parent(node)

    if (parent.pointers.length < this.fanout) {
      node.delete(newKey)
      parent.insert(newKey, newNode)
      return
    }

    node.delete(newKey)
    parent.insert(newKey, newNode)

    const rightNode = this.createNodeFunction(this.fanout, false)

    this.notifyAll({
      type: 'createNode',
      data: {
        leftNode: parent,
        node: rightNode,
        level: this.getNodeLevel(node),
      },
    })

    const k2 = parent.split(rightNode)
    this.insertParent(parent, k2, rightNode)
  }

  insert(value, pointer) {
    let leafNode

    if (this.isEmpty()) {
      this.root = this.createNodeFunction(this.fanout, true)

      leafNode = this.root

      this.notifyAll({
        type: 'createRoot',
        data: {
          node: this.root,
        },
      })
    } else {
      leafNode = this.findSupposedLeafNode(value)
    }

    if (leafNode.keys.length < leafNode.fanout - 1) {
      leafNode.insert(value, pointer)
      return
    }

    leafNode.insert(value, pointer)

    const rightNode = this.createNodeFunction(this.fanout, true)

    this.notifyAll({
      type: 'createNode',
      data: {
        leftNode: leafNode,
        node: rightNode,
        level: this.getNodeLevel(leafNode),
      },
    })

    leafNode.split(rightNode)

    this.insertParent(leafNode, leafNode.mostRightKey(), rightNode)
  }

  find(value) {}

  delete(value, pointer) {}
}
