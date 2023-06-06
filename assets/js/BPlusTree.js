class Node {
  constructor(fanout) {
    this.fanout = fanout
    this.keys = []
    this.pointers = []
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

    if (i !== -1) {
      // Caso a chave seja menor que uma das chaves do nó
      // então a chave é inserida na posição i
      // e o ponteiro da posição i é deslocado para a direita
      this.keys.splice(i, 0, value)
      this.pointers.splice(i + 1, 0, pointer)
      return
    }

    // Caso a chave seja maior que todas as chaves do nó
    // então o último ponteiro é o nó que contém a chave
    this.keys.push(value)
    this.pointers.push(pointer)
  }
}

class InternalNode extends Node {
  constructor(fanout, key, pointer) {
    super(fanout, key, pointer)
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
  }
}

class LeafNode extends Node {
  constructor(fanout, key, pointer) {
    super(fanout, key, pointer)
  }

  /**
   * Divide o nó em dois e retorna o nó da direita
   */
  split() {
    const middleIndex = Math.ceil(this.fanout / 2)
    const rightNode = new LeafNode(this.fanout)

    rightNode.keys = this.keys.slice(middleIndex)
    rightNode.pointers = this.pointers.slice(middleIndex)

    this.keys = this.keys.slice(0, middleIndex)
    this.pointers = this.pointers.slice(0, middleIndex)

    return rightNode
  }
}

class BPlusTree {
  constructor(fanout) {
    this.fanout = fanout
    this.root = null
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
      // O índice do ponteiro que aponta para o nó
      const i = c.pointers.findIndex(p => p === node)

      // Se o nó for filho de c, então c é o pai de node
      if (i !== -1) return c

      // Se o nó não for filho de c, então o pai de node é o nó que contém a chave
      c = c.pointers.find(p => p.mostLeftKey() <= node.mostLeftKey())
    }

    return c
  }

  insertParent(node, newKey, newNode) {
    if (this.root == node) {
      const newRoot = new InternalNode(this.fanout)
      newRoot.keys = [newKey]
      newRoot.pointers = [node, newNode]
      this.root = newRoot
    }

    const parent = this.parent(node)

    if (parent.keys.length < this.fanout - 1) {
      parent.insert(newKey, newNode)
      return
    }

    const middleIndex = Math.ceil((this.fanout + 1) / 2)

    const T = new InternalNode(this.fanout)
    T.keys = parent.keys
    T.pointers = parent.pointers

    T.keys.push(newKey)
    T.pointers.push(newNode)

    parent.keys = T.keys.slice(0, middleIndex - 1)
    parent.pointers = T.pointers.slice(0, middleIndex)

    const rightNode = new InternalNode(this.fanout)
    rightNode.keys = T.keys.slice(middleIndex)
    rightNode.pointers = T.pointers.slice(middleIndex)

    this.insertParent(parent, T.keys[middleIndex - 1], rightNode)
  }

  insert(value, pointer) {
    let leafNode
    if (this.isEmpty()) {
      this.root = new LeafNode(this.fanout)
      leafNode = this.root
    } else {
      leafNode = this.findSupposedLeafNode(value)
    }

    leafNode.insert(value, pointer)

    if (!leafNode.isNodeOverfull()) return
    const rightNode = leafNode.split()

    this.insertParent(leafNode, rightNode.mostLeftKey(), rightNode)
  }
}
