class BTreeNode extends BaseNode {
  constructor(fanout, isLeaf = false) {
    super(fanout)
    this.id = uuidv4()
    this.leaf = isLeaf
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

  hasMaximumKeys() {
    const maximumKeys = this.fanout - 1

    return this.keys.length >= maximumKeys
  }

  hasKey(key) {
    return this.keys.includes(key)
  }

  nonNullPointers() {
    return this.pointers.filter(pointer => pointer !== null)
  }

  lastNonNullPointer() {
    const validPointers = this.pointers.filter(p => p !== null)
    const lastNonNullPointerIndex = validPointers.length - 1

    return this.pointers[lastNonNullPointerIndex]
  }

  insert(value, pointer = null, index = null) {
    if (this.hasMaximumKeys()) return

    const keyIndex = this.leaf
      ? this.keys.findIndex(index => isLowerOrEqual(value, index))
      : this.keys.findIndex(k => isLower(value, k))
    const insertKeyIndex = keyIndex !== -1 ? keyIndex : this.keys.length
    this.keys.splice(insertKeyIndex, 0, value)

    if (!pointer && !index) this.pointers.splice(insertKeyIndex, 0, pointer)

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

  delete() {}

  split(rightNode) {
    const keysMiddleIndex = Math.ceil((this.fanout + 1) / 2) - 1
    const pointersMiddleIndex = Math.ceil((this.fanout + 1) / 2)
    const keysToInsertInRightNode = this.keys.slice(keysMiddleIndex)
    const pointersToInsertInRightNode = this.pointers.slice(pointersMiddleIndex)
  }
}
