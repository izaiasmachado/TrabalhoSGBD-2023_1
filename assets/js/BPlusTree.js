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
        isLowerOrEqual(p.mostLeftKey(), node.mostLeftKey()),
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
    function findParent(currentNode, targetNode) {
      if (currentNode === null || currentNode === undefined) {
        return null // O nó não foi encontrado na árvore
      }

      if (
        currentNode.pointers &&
        currentNode.pointers.some(
          pointer => pointer && pointer.id === targetNode.id,
        )
      ) {
        return currentNode // Encontrou o pai do nó desejado
      }

      for (const pointer of currentNode.pointers || []) {
        const parent = findParent(pointer, targetNode) // Chamada recursiva para cada filho
        if (parent !== null) {
          return parent // O pai foi encontrado em um dos filhos
        }
      }

      return null // O pai não foi encontrado
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

    this.deleteEntry(value, pointer, leafNode)
  }

  deleteEntry(value, pointer, node) {
    node.delete(value, pointer)
    /**
     * Caso seja raiz e o nó só tiver um nó filho,
     * então o nó filho vira a raiz e N é nó é removido
     */
    if (node === this.root && node.pointers.length === 1) {
      this.root = node.pointers[0]

      this.notifyAll({
        type: 'deleteRoot',
        data: {
          node,
        },
      })
    } else if (!node.hasMinimumKeys()) {
      /**
       * Caso o nó não seja raiz e o nó tiver menos que o mínimo de chaves
       * então o nó é combinado com um de seus irmãos
       */
      const parent = this.parent(node)
      const index = parent.pointers.findIndex(p => p === node)
      let sibling = parent.pointers[index - 1] || parent.pointers[index + 1]
      const sumOfKeys = node.keys.length + sibling.keys.length

      /**
       * Se a soma das chaves do nó e do irmão for menor
       * ou igual ao máximo de chaves em um nó, então os nós são combinados
       * e o nó pai é removido
       */
      if (sumOfKeys <= node.fanout - 1) {
      } else {
        console.log('redistribui os nós', node, sibling)
        parent.redistribute(node, sibling)
      }
    } else {
      console.log('redistribui os nós', node, sibling)
      /**
       * Caso contrário, o nó é redistribuído,
       * pegando emprestado uma chave do irmão
       */
      parent.redistribute(node, sibling)
    }
  }
}
