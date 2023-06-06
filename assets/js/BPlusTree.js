class Node {
  constructor(fanout) {
    this.fanout = fanout
    this.keys = []
    this.pointers = []
  }

  isNodeFull() {
    return this.keys.length === this.fanout - 1
  }

  insert(key) {
    const i = this.keys.findIndex(k => k > key)
    this.keys.splice(i, 0, key)
    this.pointers.splice(i, 0, null)
  }

  hasKey(key) {
    return this.keys.includes(key)
  }

  lastNonNullPointer() {
    const validPointers = this.pointers.filter(p => p !== null)
    const lastNonNullPointerIndex = validPointers.length - 1
    return this.pointers[lastNonNullPointerIndex]
  }
}

class InternalNode extends Node {
  constructor(fanout, key, pointer) {
    super(fanout, key, pointer)
  }
}

class LeafNode extends Node {
  constructor(fanout, key, pointer) {
    super(fanout, key, pointer)
  }
}

class BPlusTree {
  constructor(fanout) {
    this.fanout = fanout
    this.root = null
  }

  isTreeEmpty() {
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
}
