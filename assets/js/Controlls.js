class Controlls extends Observable {
  constructor() {
    super()
    this.fanout = 4
    this.treeKeys = new Set()
    this.treeSelector = TreeSelector.getInstance()
    this.init()
  }

  static getInstance() {
    if (!Controlls.instance) {
      Controlls.instance = new Controlls()
    }

    return Controlls.instance
  }

  createNewTree(treeType) {
    if (!treeType) treeType = this.treeSelector.getSelectedTreeType()
    if (this.treeVisualizer) this.treeVisualizer.clear()

    this.treeKeys = new Set()

    switch (treeType) {
      case 'b-tree':
        this.createNewBTree()
        break
      case 'b-plus-tree':
        this.createNewBPlusTree()
        break
      default:
        break
    }

    BottomBar.getInstance().reset()
  }

  createNewBPlusTree() {
    this.tree = new BPlusTree(this.fanout)
    this.treeVisualizer = new BPlusTreeVisualizer(this.tree)
  }

  createNewBTree() {
    this.tree = new BTree(this.fanout)
    this.treeVisualizer = new BTreeVisualizer(this.tree)
  }

  init() {
    this.createNewTree('b-plus-tree')

    this.treeSelector.setChangeTreeCallback(data => {
      this.createNewTree(data)
    })

    ActionListener.getInstance().setCallback(data => {
      this.handleAction(data)
    })

    OptionListener.getInstance().setChangeFanoutCallback(fanout => {
      this.fanout = fanout
      this.createNewTree()
    })

    OptionListener.getInstance().setClearTreeCallback(() => {
      this.createNewTree()
    })
  }

  handleAction(data) {
    const { type } = data

    switch (type) {
      case 'manual':
        this.handleManualAction(data)
        break
      case 'random':
        this.handleRandomAction(data)
        break
      default:
        break
    }

    console.log(data)
    console.log(this.tree.root)
  }

  handleRandomAction(data) {
    const { action, count } = data
    BottomBar.getInstance().startTimer()

    switch (action) {
      case 'insert':
        const { start, end } = data
        const randomNumbers = generateRandomUniqueNumbers(start, end, count)

        if (!randomNumbers) return

        randomNumbers.forEach(value => {
          this.treeKeys.add(value)
          this.tree.insert(value)
        })
        break
      case 'delete':
        // GENERATE count random numbers
        // DELETE count random numbers

        if (this.treeKeys.size < count) return

        for (let i = 0; i < count; i++) {
          const randomIndex = Math.floor(Math.random() * this.treeKeys.size)
          const randomKey = Array.from(this.treeKeys)[randomIndex]
          this.treeKeys.delete(randomKey)
          this.tree.delete(randomKey)
        }
        break
      default:
        break
    }
  }

  handleManualAction(data) {
    const { action, value } = data

    switch (action) {
      case 'insert':
        this.treeKeys.add(value)
        this.tree.insert(value)
        break
      case 'search':
        this.tree.find(value)
        break
      case 'delete':
        this.treeKeys.delete(value)
        this.tree.delete(value)
        break
      default:
        break
    }
  }
}

window.addEventListener('load', () => {
  Controlls.getInstance()
})
