class BPlusTree extends Observable {
  constructor(fanout) {
    super()
    this.fanout = fanout
    this.root = null
    this.createNodeFunction = this.defaultCreateNodeFunction
  }

  defaultCreateNodeFunction(fanout, isLeaf) {
    return isLeaf ? new LeafNode(fanout) : new InternalNode(fanout)
  }

  setCreateNodeFunction(createNodeFunction) {
    this.createNodeFunction = createNodeFunction
  }

  getNodeLevel(node) {
    if (node === null) return 0

    let c = this.root
    let level = 0

    while (c instanceof InternalNode) {
      const i = c.pointers.findIndex(p => p === node)

      if (i !== -1) return level + 1

      c = c.pointers.find(p => p.mostLeftKey() <= node.mostLeftKey())
      level++
    }

    return level
  }

  // imprime a árvore em JSON
  toJSON() {
    // {
    //   id: 1,
    // keys: ['a', 'b'],
    // children: [
    //   { id: 2, keys: ['c', 'd'], children: [] },
    //   { id: 3, keys: ['e', 'f'], children: [] },
    //   { id: 4, keys: ['g', 'h'], children: [] },
    // ]
    // }
    const root = this.root
    if (root === null) return null

    const queue = [root]
    const tree = { id: 1, keys: root.keys, children: [] }

    while (queue.length > 0) {
      const node = queue.shift()

      if (node instanceof InternalNode) {
        const children = node.pointers.filter(
          p => p !== null && p !== undefined,
        )
        // const childrenKeys = children.map(c => c.keys)

        const childrenNodes = children.map(c => {
          // const id =
          return { keys: c.keys, children: [] }
        })

        tree.children.push(...childrenNodes)

        queue.push(...children)
      }
    }

    return tree
  }

  isEmpty() {
    return this.root === null
  }

  /**
   * Dado um valor de chave, encontra o nó folha que a chave deveria estar
   */
  findSupposedLeafNode(value) {
    let c = this.root

    while (c instanceof InternalNode) {
      const i = c.keys.findIndex(k => value <= k)
      // Menor índice tal que value <= c.keys[i]
      // De modo que se value > c.keys[i] então i = -1
      if (i === -1) {
        // Caso a chave seja maior que todas as chaves do nó
        // então o último ponteiro é o nó que contém a chave
        c = c.lastNonNullPointer()
      } else if (value === c.keys[i]) {
        // Caso a chave seja igual a uma das chaves do nó
        // então o ponteiro da direita é o nó que contém a chave
        c = c.pointers[i + 1]
      } else {
        // Caso a chave seja menor que uma das chaves do nó
        // então o ponteiro da esquerda é o nó que contém a chave
        // console.log('aquiiiiii', c)
        c = c.pointers[i]
      }
    }

    return c
  }

  find(value) {
    const leafNode = this.findSupposedLeafNode(value)
    if (leafNode.hasKey(value)) return leafNode
    return null
  }

  /**
   * Encotra o nó pai de um nó
   */
  parent(node) {
    let c = this.root

    while (c instanceof InternalNode) {
      const i = c.pointers.findIndex(p => p === node)

      if (i !== -1) return c
      c = c.pointers.find(p => p.mostLeftKey() <= node.mostLeftKey())
    }

    return c
  }

  insertParent(node, newKey, newNode) {
    if (this.root == node) {
      const newRoot = this.createNodeFunction(this.fanout, false)
      newRoot.insert(newKey, node)
      newRoot.pointers.push(newNode)
      this.root = newRoot
      return
    }

    const parent = this.parent(node)
    if (parent.pointers.length < this.fanout) {
      parent.insert(newKey, newNode)
      return
    }

    parent.insert(newKey, newNode)

    // Caso o nó pai esteja cheio
    // então o nó pai é dividido em dois
    // e o nó pai do nó pai é inserido no nó pai do nó
    // e assim por diante
    const rightNode = this.createNodeFunction(this.fanout, false)
    parent.split(rightNode)
    this.insertParent(parent, rightNode.mostLeftKey(), rightNode)
  }

  insert(value, pointer) {
    let leafNode
    if (this.isEmpty()) {
      this.root = this.createNodeFunction(this.fanout, true)
      leafNode = this.root
    } else {
      leafNode = this.findSupposedLeafNode(value)
    }

    if (leafNode.keys.length < leafNode.fanout - 1) {
      leafNode.insert(value, pointer)
      return
    }

    leafNode.insert(value, pointer)
    const rightNode = this.createNodeFunction(this.fanout, true)
    leafNode.split(rightNode)
    this.insertParent(leafNode, rightNode.mostLeftKey(), rightNode)
  }
}
