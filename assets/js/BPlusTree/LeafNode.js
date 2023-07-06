class LeafNode extends BPlusTreeNode {
  constructor(fanout) {
    super(fanout)
  }

  hasTooFewKeys() {
    const minimumKeys = Math.ceil((this.fanout - 1) / 2)
    return this.keys.length < minimumKeys
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
