class BTreeNode extends BaseNode {
  constructor(fanout) {
    super(fanout)
    this.id = uuidv4()
    this.keys = []
    this.pointers = []
  }

  isLeaf() {
    if (this.pointers.length) {
      return false
    }

    return true
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

  insert(value, pointer = null) {
    const keyIndex = this.keys.findIndex(key => isLowerOrEqual(value, key))
    const insertKeyIndex = keyIndex !== -1 ? keyIndex : this.keys.length

    this.keys.splice(insertKeyIndex, 0, value)

    if (pointer !== null) this.pointers.splice(insertKeyIndex + 1, 0, pointer)

    this.notifyAll({
      type: 'insertKey',
      data: {
        key: {
          node: this,
          value,
          index: insertKeyIndex,
        },
        pointer,
      },
    })
  }

  delete(value) {
    const keyIndex = this.keys.findIndex(key => isLowerOrEqual(value, key))

    if (value !== this.keys[keyIndex]) return

    this.keys.splice(keyIndex, 1)

    this.pointers.splice(keyIndex + 1, 1)

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

  split(rightNode) {
    const keyMiddleIndex = Math.ceil(this.fanout / 2)
    const keysRightNode = this.keys.slice(keyMiddleIndex)
    const pointersMiddleIndex = Math.ceil(this.fanout / 2)
    const pointersToInsertInRightNode = this.pointers.slice(pointersMiddleIndex)

    if (pointersToInsertInRightNode.length)
      rightNode.pointers.push(pointersToInsertInRightNode[0])

    keysRightNode.forEach((key, index) => {
      this.delete(key)
      rightNode.insert(key, pointersToInsertInRightNode[index + 1])
    })
  }
}
