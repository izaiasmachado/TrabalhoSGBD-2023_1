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

  insert(value, pointer = null) {
    const keyIndex = this.leaf
      ? this.keys.findIndex(key => isLowerOrEqual(value, key))
      : this.keys.findIndex(key => isLower(value, key))
    const insertKeyIndex = keyIndex !== -1 ? keyIndex : this.keys.length
    this.keys.splice(insertKeyIndex, 0, value)

    const insertsAt = this.leaf ? insertKeyIndex : insertKeyIndex + 1
    this.pointers.splice(insertsAt, 0, pointer)

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
    const i = this.keys.findIndex(k => isLowerOrEqual(value, k))

    if (value !== this.keys[i]) return

    this.keys.splice(i, 1)

    this.leaf ? this.pointers.splice(i, 1) : this.pointers.splice(i + 1, 1)

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
    if (!this.leaf) {
      const keyMiddleIndex = Math.ceil((this.fanout + 1) / 2) - 1
      const pointersMiddleIndex = Math.ceil((this.fanout + 1) / 2)
      const keysToInsertInRightNode = this.keys.slice(keyMiddleIndex)
      const pointersToInsertInRightNode =
        this.pointers.slice(pointersMiddleIndex)

      keysToInsertInRightNode.forEach((key, index) => {
        const pointer = pointersToInsertInRightNode[index]
        this.delete(key)
        rightNode.insert(key, pointer)
      })

      const k2 = rightNode.mostLeftKey()
      rightNode.delete(k2)
      return k2
    }

    const keyMiddleIndex = Math.ceil(this.fanout / 2)
    const keysRightNode = this.keys.slice(keyMiddleIndex)
    const pointersRightNode = this.pointers.slice(keyMiddleIndex)

    keysRightNode.forEach((key, index) => {
      this.delete(key)
      rightNode.insert(key, pointersRightNode[index])
    })
  }
}
