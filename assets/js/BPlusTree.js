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

    parent.insert(newKey, newNode)

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

    parent.split(rightNode)
    this.insertParent(parent, rightNode.mostLeftKey(), rightNode)
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
    this.insertParent(leafNode, rightNode.mostLeftKey(), rightNode)
  }

  delete(value, pointer) {
    const leafNode = this.find(value)
    if (leafNode === null) return
    console.log('leafNode', leafNode.clone())
    this.deleteEntry(value, pointer, leafNode)
  }

  deleteEntry(value, pointer, node) {
    console.log('=== deleteEntry ===', value, node.clone())

    /**
     * Deleta a chave do nó
     */
    node.delete(value, pointer)

    console.log('=== deleteEntry ===', value, node.clone())

    if (node === this.root && node.pointers.length == 1) {
      /**
       * Caso seja raiz e o nó só tiver um nó filho,
       * então o nó filho vira a raiz e N é nó é removido
       */
      console.log('É raiz e só tem um filho', node.clone())
      // this.root = node.pointers[0]
      this.root = node.nonNullPointers()[0]
      console.log('Nova raiz', this.root.clone())

      this.notifyAll({
        type: 'deleteRoot',
        data: {
          node,
        },
      })
    } else if (node.pointers.length < Math.ceil(this.fanout / 2)) {
      console.log('Nó tem menos que o mínimo de chaves', node.clone())
      /**
       * Caso o nó não seja raiz e o nó tiver menos que o mínimo de chaves
       * então o nó é combinado com um de seus irmãos
       */
      const parent = this.parent(node)
      if (parent === null) {
        console.log('parent is null', node.clone())
        return
      }
      console.log('parent', parent.clone())
      const index = parent.pointers.findIndex(p => p === node)
      console.log('index', index)
      let sibling = parent.pointers[index - 1] || parent.pointers[index + 1]
      console.log('sibling', sibling.clone())
      const sumOfKeys = node.keys.length + sibling.keys.length
      console.log('sumOfKeys', sumOfKeys)
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
      console.log('k', k)

      /**
       * Se a soma das chaves do nó e do irmão for menor
       * ou igual ao máximo de chaves em um nó, então os nós são combinados
       * e o nó pai é removido
       */
      if (sumOfKeys <= node.fanout - 1) {
        // isNodePredecessorSibling é true se o nó for o irmão mais a esquerda
        if (isNodePredecessorSibling) {
          console.log('swap node e sibling')
          // swap node e sibling
          const temp = node
          node = sibling
          sibling = temp
        }

        if (node instanceof InternalNode) {
          console.log('node instanceof InternalNode')
          // append K' e os ponteiros do nó no irmão
          sibling.insert(k, node.pointers[0])
          sibling.pointers = sibling.pointers.concat(node.nonNullPointers())
        } else {
          console.log('node instanceof LeafNode')
          const nodeKeys = node.keys
          const nodePointers = node.pointers

          nodePointers.forEach((pointer, index) => {
            if (pointer === null) return
            if (nodeKeys[index] === undefined) return
            node.delete(nodeKeys[index], pointer)
            sibling.insert(nodeKeys[index], pointer)
          })

          sibling.pointers.push(node.pointers[node.pointers.length - 1])

          this.deleteEntry(k, node, parent)
          this.notifyAll({
            type: 'deleteNode',
            data: {
              node,
              level: initialNodeLevel - 1,
            },
          })
        }

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
