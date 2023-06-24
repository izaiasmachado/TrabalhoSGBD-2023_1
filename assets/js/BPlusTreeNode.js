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

  isNodeFull() {
    return this.keys.length === this.fanout - 1
  }

  isNodeOverfull() {
    return this.keys.length >= this.fanout
  }

  hasKey(key) {
    return this.keys.includes(key)
  }

  lastNonNullPointer() {
    const validPointers = this.pointers.filter(p => p !== null)
    const lastNonNullPointerIndex = validPointers.length - 1
    return this.pointers[lastNonNullPointerIndex]
  }

  insert(value, pointer) {
    const i = this.keys.findIndex(k => value <= k)

    // Caso a chave seja menor que uma das chaves do nó
    // então a chave é inserida na posição i
    // e o ponteiro da posição i é deslocado para a direita\
    // Caso a chave seja maior que todas as chaves do nó
    // então o último ponteiro é o nó que contém a chave
    const insertKeyIndex = i !== -1 ? i : this.keys.length

    this.keys.splice(insertKeyIndex, 0, value)
    this.pointers.splice(insertKeyIndex, 0, pointer)
    this.notifyAll({
      type: 'insertKey',
      node: this,
      data: {
        key: {
          value,
          index: insertKeyIndex,
        },
        pointer,
      },
    })
  }

  delete(value) {
    const i = this.keys.findIndex(k => value <= k)

    // Caso a chave seja igual a uma das chaves do nó
    // então a chave é removida da posição i
    // e o ponteiro da chave é removido da posição i + 1
    // Caso a chave seja menor que uma das chaves do nó
    // então a chave não existe no nó
    if (value !== this.keys[i]) return

    this.keys.splice(i, 1)
    this.pointers.splice(i, 1)
    this.notifyAll({
      type: 'deleteKey',
      node: this,
      data: {
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
}

class InternalNode extends BPlusTreeNode {
  constructor(fanout) {
    super(fanout)
  }

  split() {
    const middleIndex = Math.ceil((this.fanout + 1) / 2)
    const rightNode = new InternalNode(this.fanout)

    // O nó da direita recebe as chaves e ponteiros da metade para frente
    rightNode.keys = this.keys.slice(middleIndex)
    rightNode.pointers = this.pointers.slice(middleIndex)

    // O nó da esquerda recebe as chaves e ponteiros da metade para trás
    this.keys = this.keys.slice(0, middleIndex - 1)
    this.pointers = this.pointers.slice(0, middleIndex)

    return rightNode
  }
}

class LeafNode extends BPlusTreeNode {
  constructor(fanout) {
    super(fanout)
  }

  /**
   * Divide o nó em dois e retorna o nó da direita
   */
  split(rightNode) {
    console.log('split', this.clone(), rightNode.clone())

    const middleIndex = Math.ceil(this.fanout / 2)
    const keysRightNode = this.keys.slice(middleIndex)
    const pointersRightNode = this.pointers.slice(middleIndex)

    keysRightNode.forEach(key => this.delete(key))

    keysRightNode.forEach((key, index) => {
      rightNode.insert(key, pointersRightNode[index])
    })
  }
}
