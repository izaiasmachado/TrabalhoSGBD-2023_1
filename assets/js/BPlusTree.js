class BPlusTree extends Observable {
  constructor(fanout) {
    super()
    this.fanout = fanout
    this.root = null
    this.createNodeFunction = this.defaultCreateNodeFunction
  }

  defaultCreateNodeFunction(fanout, isLeaf) {
    const createdNode = isLeaf ? new LeafNode(fanout) : new InternalNode(fanout)
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

    let c = this.root
    let level = 0

    while (c instanceof InternalNode) {
      const i = c.pointers.findIndex(p => p === node)

      if (i !== -1) return level + 1

      c = c.pointers.find(p =>
        isLowerOrEqual(p.mostRightKey(), node.mostLeftKey()),
      )
      level++
    }

    return level
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
      const i = c.keys.findIndex(k => isLower(value, k))

      if (i === -1) {
        // Caso nenhuma chave seja menor que a chave
        // então o ponteiro da direita é o nó que deveria conter a chave
        c = c.lastNonNullPointer()
      } else if (value === c.keys[i]) {
        // Caso a chave seja igual a uma das chaves do nó
        // então o ponteiro da direita é o nó que contém a chave
        c = c.pointers[i + 1]
      } else {
        // Caso a chave seja menor que uma das chaves do nó
        // então o ponteiro da esquerda é o nó que contém a chave
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

  parent(node) {
    const findParent = (currentNode, targetNode) => {
      if (currentNode === null || currentNode === undefined) {
        return null // The node was not found in the tree
      }

      if (
        currentNode.pointers &&
        currentNode.pointers.some(
          pointer => pointer && pointer.id === targetNode.id,
        )
      ) {
        return currentNode // Found the parent of the desired node
      }

      if (currentNode.pointers) {
        for (const pointer of currentNode.pointers) {
          const parent = findParent(pointer, targetNode) // Recursive call for each child
          if (parent !== null) {
            return parent // The parent was found in one of the children
          }
        }
      }

      return null // The parent was not found
    }

    return findParent(this.root, node)
  }

  insertParent(node, newKey, newNode) {
    console.log('==================')
    console.log('>> node', node.keys.slice())
    console.log('>> newKey', newKey)
    console.log('>> newNode', newNode.keys.slice())

    if (this.root == node) {
      const newRoot = this.createNodeFunction(this.fanout, false)

      this.notifyAll({
        type: 'createRoot',
        data: {
          node: newRoot,
        },
      })

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

    console.log('Before split', parent.keys.slice())
    parent.insert(newKey, newNode)

    console.log('Before split 2', parent.keys.slice())

    // Caso o nó pai esteja cheio
    // então o nó pai é dividido em dois
    // e o nó pai do nó pai é inserido no nó pai do nó
    // e assim por diante
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
    console.log('===== INSERT =====')
    console.log('>> value', value)
    console.log('>> pointer', pointer)
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

    console.log('Before split LEAF', leafNode.keys.slice())
    leafNode.insert(value, pointer)
    console.log('After split LEAF 2', leafNode.keys.slice())
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

    console.log('After split LEAF', leafNode.keys.slice())
    this.insertParent(leafNode, rightNode.mostLeftKey(), rightNode)
  }

  delete(value, pointer) {
    const leafNode = this.find(value)
    if (leafNode === null) return
    this.deleteEntry(value, pointer, leafNode)
  }

  deleteEntry(value, pointer, node) {
    /**
     * Deleta a chave do nó
     */

    node.delete(value, pointer)

    if (node === this.root && node.pointers.length == 1) {
      /**
       * Caso seja raiz e o nó só tiver um nó filho,
       * então o nó filho vira a raiz e N é nó é removido
       */
      // this.root = node.pointers[0]
      this.root = node.nonNullPointers()[0]

      this.notifyAll({
        type: 'deleteRoot',
        data: {
          node,
        },
      })
    } else if (node.pointers.length < Math.ceil(this.fanout / 2)) {
      /**
       * Caso o nó não seja raiz e o nó tiver menos que o mínimo de chaves
       * então o nó é combinado com um de seus irmãos
       */
      const parent = this.parent(node)
      if (parent === null) return

      const index = parent.pointers.findIndex(p => p === node)
      let sibling = parent.pointers[index - 1] || parent.pointers[index + 1]
      const sumOfKeys = node.keys.length + sibling.keys.length
      const initialNodeLevel = this.getNodeLevel(node)
      const isNodePredecessorSibling = isLowerOrEqual(
        node.mostRightKey(),
        sibling.mostLeftKey(),
      )
      /**
       * K' é o valor da chave que está no nó pai e que separa os nós
       * node e sibling
       */

      const k = parent.keys[index - 1] || parent.keys[index]

      /**
       * Se a soma das chaves do nó e do irmão for menor
       * ou igual ao máximo de chaves em um nó, então os nós são combinados
       * e o nó pai é removido
       */
      if (sumOfKeys <= node.fanout - 1) {
        if (isNodePredecessorSibling) {
          const temp = node
          node = sibling
          sibling = temp
        }

        if (node instanceof InternalNode) {
          const nodePointers = node.nonNullPointers()
          const nodeKeys = node.keys.concat(k)
          nodeKeys.sort()

          nodeKeys.forEach((key, i) => {
            node.delete(key)
            sibling.insert(key, nodePointers[i])
          })
        } else {
          const nodeKeys = node.keys.slice()
          const nodePointers = node.nonNullPointers()

          nodeKeys.forEach((key, index) => {
            node.delete(key)
            sibling.insert(key, nodePointers[index])
          })
        }

        this.notifyAll({
          type: 'deleteNode',
          data: {
            node,
            level: initialNodeLevel - 1,
          },
        })

        this.deleteEntry(k, node, parent)
      } else {
        const isSiblingPredecessor = isLower(
          sibling.mostRightKey(),
          node.mostLeftKey(),
        )

        if (isSiblingPredecessor) {
          node.redistribute(sibling, parent, k)
        } else {
          sibling.redistribute(node, parent, k)
        }
      }
    }
  }
}
