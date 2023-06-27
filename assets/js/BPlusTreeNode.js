class BaseNode extends Observable {
  constructor(fanout) {
    super()
    this.fanout = fanout
    this.keys = []
    this.pointers = []
  }

  clone() {
    const clone = JSON.parse(JSON.stringify(this))
    return clone
  }
}

class BPlusTreeNode extends BaseNode {
  constructor(fanout) {
    super(fanout)
    this.id = uuidv4()
  }

  mostLeftKey() {
    return this.keys[0]
  }

  mostLeftPointer() {
    return this.pointers[0]
  }

  mostRightKey() {
    return this.keys[this.keys.length - 1]
  }

  mostRightPointer() {
    return this.pointers[this.pointers.length - 1]
  }

  isNodeFull() {
    return this.keys.length === this.fanout - 1
  }

  isNodeOverfull() {
    return this.keys.length >= this.fanout
  }

  hasMinimumKeys() {
    const minimumKeys = Math.ceil((this.fanout - 1) / 2)
    return this.keys.length >= minimumKeys
  }

  hasKey(key) {
    return this.keys.includes(key)
  }

  nonNullPointers() {
    return this.pointers.filter(
      p => p !== null && p.keys.length > 0 && p.pointers.length > 0,
    )
  }

  lastNonNullPointer() {
    const validPointers = this.pointers.filter(p => p !== null)
    const lastNonNullPointerIndex = validPointers.length - 1
    return this.pointers[lastNonNullPointerIndex]
  }

  insert(value, pointer, index) {
    this.notifyAll({
      type: 'insertKey',
      data: {
        key: {
          node: this,
          value,
          index,
        },
        pointer,
      },
    })
  }

  insertKey(value) {
    const i = this.keys.findIndex(k => isLowerOrEqual(value, k))
    const insertKeyIndex = i !== -1 ? i : this.keys.length
    this.keys.splice(insertKeyIndex, 0, value)

    this.notifyAll({
      type: 'insertKey',
      data: {
        node: this,
        key: {
          value,
          index: insertKeyIndex,
        },
      },
    })
  }

  delete(value) {
    this.notifyAll({
      type: 'deleteKey',
      data: {
        node: this,
        key: {
          value,
        },
      },
    })
  }

  toJSON() {
    const clone = JSON.parse(
      JSON.stringify({
        id: this.id,
        keys: this.keys,
        pointers: this.pointers,
      }),
    )
    return clone
  }

  replaceKey(oldKey, newKey) {
    console.log('===== REPLACE KEY =====')
    console.log('oldKey', oldKey)
    console.log('newKey', newKey)
    console.log('this', this.keys.slice())
    const i = this.keys.findIndex(k => isLowerOrEqual(oldKey, k))
    if (i === -1) return
    this.keys[i] = newKey
    console.log('this', this.keys.slice())

    this.notifyAll({
      type: 'replaceKey',
      data: {
        node: this,
        oldKey: {
          value: oldKey,
        },
        newKey: {
          value: newKey,
        },
      },
    })
  }

  /**
   * Sabendo que o nó tem menos que o mínimo de chaves,
   * então o nó é combinado com um de seus irmãos
   */
  redistribute(sibling, parent, k) {
    console.log('===== REDISTRIBUTE =====')
    console.log('this', this.keys.slice())
    console.log('sibling', sibling.keys.slice())
    console.log('parent', parent.keys.slice())

    const isSiblingPredecessor = isLowerOrEqual(
      sibling.mostRightKey(),
      this.mostLeftKey(),
    )

    console.log('isSiblingPredecessor', isSiblingPredecessor)

    if (isSiblingPredecessor) {
      const predecessorKey = sibling.mostRightKey()
      const predecessorPointer = sibling.mostRightPointer()

      console.log('predecessorKey', predecessorKey)
      console.log('predecessorPointer', predecessorPointer)

      // remova a útima chave do irmão predecessor
      sibling.delete(predecessorKey, predecessorPointer)

      // insira a chave e o ponteiro do predecessor no nó
      this.insert(predecessorKey, predecessorPointer)

      console.log('this', this.keys.slice())

      // atualize a chave do pai
      parent.replaceKey(k, predecessorKey)
    } else {
      const predecessorKey = sibling.mostLeftKey()
      const predecessorPointer = sibling.mostLeftPointer()

      console.log('predecessorKey', predecessorKey)
      console.log('predecessorPointer', predecessorPointer)

      // remova a útima chave do irmão predecessor
      sibling.delete(predecessorKey, predecessorPointer)

      // insira a chave e o ponteiro do predecessor no nó
      this.insert(predecessorKey, predecessorPointer)

      console.log('this', this.keys.slice())

      // atualize a chave do pai
      parent.replaceKey(k, predecessorKey)
    }
  }

  deleteKey(value) {
    const i = this.keys.findIndex(k => isLowerOrEqual(value, k))

    if (value !== this.keys[i]) return
    this.keys.splice(i, 1)

    this.notifyAll({
      type: 'deleteKey',
      data: {
        node: this,
        key: {
          value,
        },
      },
    })
  }
}

class InternalNode extends BPlusTreeNode {
  constructor(fanout) {
    super(fanout)
  }

  insert(value, pointer) {
    /**
     * Dado o valor e o ponteiro, percorra as chaves do nó
     * até encontrar a posição i em que o valor é menor
     * que alguma das chaves do nó
     */

    const i = this.keys.findIndex(k => isLower(value, k))
    const insertKeyIndex = i !== -1 ? i : this.keys.length
    // Caso a chave seja menor que uma das chaves do nó
    // então a chave é inserida na posição i
    // e o ponteiro da posição i é deslocado para a direita
    // Caso a chave seja maior que todas as chaves do nó
    // então a chave é inserida na última posição
    this.keys.splice(insertKeyIndex, 0, value)
    this.pointers.splice(insertKeyIndex + 1, 0, pointer)
    super.insert(value, pointer, insertKeyIndex)
  }

  delete(value) {
    const i = this.keys.findIndex(k => isLowerOrEqual(value, k))

    // Caso a chave seja igual a uma das chaves do nó
    // então a chave é removida da posição i
    // e o ponteiro da chave é removido da posição i + 1
    // Caso a chave seja menor que uma das chaves do nó
    // então a chave não existe no nó
    if (value !== this.keys[i]) return

    this.keys.splice(i, 1)
    this.pointers.splice(i + 1, 1)
    super.delete(value)
  }

  split(rightNode) {
    const middleIndex = Math.ceil(this.fanout / 2)
    const pointersMiddleIndex = Math.ceil((this.fanout + 1) / 2)
    const keysToInsertInRightNode = this.keys.slice(middleIndex)
    const pointersToInsertInRightNode = this.pointers.slice(pointersMiddleIndex)

    keysToInsertInRightNode.forEach((key, index) => {
      const pointer = pointersToInsertInRightNode[index]
      this.delete(key)
      rightNode.insert(key, pointer)
    })

    if (keysToInsertInRightNode.length < pointersToInsertInRightNode.length) {
      const lastPointer = this.pointers[this.pointers.length - 1]
      this.pointers = this.pointers.filter(p => p !== lastPointer)
      rightNode.pointers.push(lastPointer)
    }

    const k2 = rightNode.mostLeftKey()
    rightNode.deleteKey(k2)
    return k2
  }
}

class LeafNode extends BPlusTreeNode {
  constructor(fanout) {
    super(fanout)
  }

  insert(value, pointer) {
    const i = this.keys.findIndex(k => isLowerOrEqual(value, k))

    // Caso a chave seja menor que uma das chaves do nó
    // então a chave é inserida na posição i
    // e o ponteiro da posição i é deslocado para a direita\
    // Caso a chave seja maior que todas as chaves do nó
    // então o último ponteiro é o nó que contém a chave
    const insertKeyIndex = i !== -1 ? i : this.keys.length
    this.keys.splice(insertKeyIndex, 0, value)
    this.pointers.splice(insertKeyIndex, 0, pointer)
    super.insert(value, pointer, insertKeyIndex)
  }

  delete(value) {
    const i = this.keys.findIndex(k => isLowerOrEqual(value, k))

    // Caso a chave seja igual a uma das chaves do nó
    // então a chave é removida da posição i
    // e o ponteiro da chave é removido da posição i + 1
    // Caso a chave seja menor que uma das chaves do nó
    // então a chave não existe no nó
    if (value !== this.keys[i]) return

    this.keys.splice(i, 1)
    this.pointers.splice(i, 1)
    super.delete(value)
  }

  /**
   * Divide o nó em dois e retorna o nó da direita
   */
  split(rightSibling) {
    const middleIndex = Math.ceil(this.fanout / 2)
    const keysRightNode = this.keys.slice(middleIndex)
    const pointersRightNode = this.pointers.slice(middleIndex)

    keysRightNode.forEach((key, index) => {
      this.delete(key)
      rightSibling.insert(key, pointersRightNode[index])
    })
  }
}
