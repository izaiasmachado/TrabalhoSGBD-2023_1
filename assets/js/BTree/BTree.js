class BTree extends Observable {
  constructor(fanout) {
    super()
    this.fanout = fanout
    this.root = null
    this.createNodeFunction = this.defaultCreateNodeFunction
  }

  getRoot() {
    return this.root
  }

  defaultCreateNodeFunction(fanout) {
    const createdNode = new BTreeNode(fanout)
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

    while (!root.isLeaf()) {
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

    while (!node.isLeaf()) {
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

      if (!currentNode.pointers || currentNode.isLeaf()) {
        return null
      }

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

  insertParent(node, newNode) {
    const value = node.mostRightKey()

    if (this.root == node) {
      const newRoot = this.createNodeFunction(this.fanout)

      this.notifyAll({
        type: 'createRoot',
        data: {
          node: newRoot,
        },
      })

      node.delete(value)
      newRoot.insert(value, node)
      newRoot.pointers.push(newNode)
      this.root = newRoot
      return
    }

    const parent = this.parent(node)

    if (parent.keys.length < this.fanout - 1) {
      node.delete(value)
      parent.insert(value, newNode)
      return
    }

    node.delete(value)
    parent.insert(value, newNode)

    const rightNode = this.createNodeFunction(this.fanout)

    this.notifyAll({
      type: 'createNode',
      data: {
        leftNode: parent,
        node: rightNode,
        level: 0, //ISSO É PROVISÓRIO
      },
    })

    parent.split(rightNode)

    this.insertParent(parent, rightNode)
  }

  insert(value) {
    let leafNode

    if (this.isEmpty()) {
      this.root = this.createNodeFunction(this.fanout)

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
      leafNode.insert(value)
      return
    }

    leafNode.insert(value)

    const rightNode = this.createNodeFunction(this.fanout)

    this.notifyAll({
      type: 'createNode',
      data: {
        leftNode: leafNode,
        node: rightNode,
        level: 0, //ISSO É PROVISÓRIO
      },
    })

    leafNode.split(rightNode)

    this.insertParent(leafNode, rightNode)
  }

  find(value) {
    const leafNode = this.findSupposedLeafNode(value)
    if (leafNode.hasKey(value)) return leafNode
    return null
  }

  delete(value, pointer) {}
}
