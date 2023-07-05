class BPlusTreeNode extends BaseNode {
  constructor(fanout) {
    super(fanout)
    this.id = uuidv4()
    this.keys = []
    this.pointers = []
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
    return this.pointers.filter(p => p !== null)
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
