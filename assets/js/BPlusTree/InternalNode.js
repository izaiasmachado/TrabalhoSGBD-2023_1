class InternalNode extends BPlusTreeNode {
  constructor(fanout) {
    super(fanout)
  }

  hasTooFewKeys() {
    const minimumKeys = Math.ceil(this.fanout / 2)
    return this.keys.length < minimumKeys
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
    const middleIndex = Math.ceil((this.fanout + 1) / 2) - 1
    const pointersMiddleIndex = Math.ceil((this.fanout + 1) / 2)
    const keysToInsertInRightNode = this.keys.slice(middleIndex)
    const pointersToInsertInRightNode = this.pointers.slice(pointersMiddleIndex)

    keysToInsertInRightNode.forEach((key, index) => {
      const pointer = pointersToInsertInRightNode[index]
      this.delete(key)
      rightNode.insert(key, pointer)
    })

    const k2 = rightNode.mostLeftKey()
    rightNode.deleteKey(k2)
    return k2
  }
}
