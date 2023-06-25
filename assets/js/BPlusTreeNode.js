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

  /**
   * Sabendo que o nó tem menos que o mínimo de chaves,
   * então o nó é combinado com um de seus irmãos
   */
  redistribute(node, sibling) {
    const isNodeToTheLeft = isLowerOrEqual(
      node.mostLeftKey(),
      sibling.mostLeftKey(),
    )

    /**
     * Caso o nó seja o irmão mais a esquerda,
     * então o nó pega emprestado a chave mais esquerda do irmão
     *
     * Caso o nó seja o irmão mais a direita,
     * então o nó pega emprestado a chave mais direita do irmão
     */
    const borrowedKey = isNodeToTheLeft
      ? sibling.mostLeftKey()
      : sibling.mostRightKey()
    const borrowedPointer = isNodeToTheLeft
      ? sibling.mostLeftPointer()
      : sibling.mostRightPointer()

    // Remover o nó mais da direita do irmão
    sibling.delete(borrowedKey, borrowedPointer)

    // Inserir a chave e o ponteiro no nó
    node.insert(borrowedKey, borrowedPointer)
  }
}

class InternalNode extends BPlusTreeNode {
  constructor(fanout) {
    super(fanout)
  }

  insert(value, pointer) {
    const i = this.keys.findIndex(k => isLowerOrEqual(value, k))

    // Caso a chave seja menor que uma das chaves do nó
    // então a chave é inserida na posição i
    // e o ponteiro da posição i é deslocado para a direita
    // Caso a chave seja maior que todas as chaves do nó
    // então o último ponteiro é o nó que contém a chave

    const insertKeyIndex = i !== -1 ? i : this.keys.length

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
    const middleIndex = Math.ceil((this.fanout + 1) / 2)
    const keysRightNode = this.keys.slice(middleIndex)
    const pointersRightNode = this.pointers.slice(middleIndex + 1)

    keysRightNode.forEach(key => this.delete(key))
    pointersRightNode.forEach(pointer => {
      if (pointer !== null) {
        rightNode.insert(pointer.mostLeftKey(), pointer)
        this.delete(pointer.mostLeftKey())
      }
    })
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

    keysRightNode.forEach(key => this.delete(key))
    keysRightNode.forEach((key, index) => {
      rightSibling.insert(key, pointersRightNode[index])
    })
  }
}
