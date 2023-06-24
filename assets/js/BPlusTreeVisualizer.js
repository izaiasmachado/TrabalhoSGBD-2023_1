class BPlusTreeVisualizer {
  constructor(tree) {
    this.tree = tree
    this.animationQueue = []
    this.animationDelay = 100
  }

  init() {}

  processAnimationQueue() {
    // Check if there are any steps remaining in the queue
    if (this.animationQueue.length > 0) {
      const step = this.animationQueue.shift()

      setTimeout(() => {
        this.processAnimationQueue()
      }, animationDelay) // Set an appropriate delay for smooth animations
    }
  }

  clearAnimationQueue() {
    this.animationQueue = []
  }

  calculateAnimationSteps() {}

  insert(key, value) {
    const before = this.tree.toJSON()
    this.tree.insert(key, value)
    const after = this.tree.toJSON()

    this.animationQueue.push({
      before,
      after,
      type: 'insert',
    })

    this.processAnimationQueue()

    this.update()
  }

  delete(key) {
    this.update()
  }
}

class BTreeNodeVisualizer {
  constructor(tree) {
    // receives a BTreeNode
    // and observes its changes
    // add BTreeNodeVisualizer to BTreeNode observers
  }

  init() {
    this.element = document.createElement('div')
    this.element.classList.add('node')
  }

  update() {}
}
