class Controlls extends Observable {
  constructor() {
    super()
    this.fanout = 4
    this.treeKeys = new Set()
    this.treeSelector = TreeSelector.getInstance()
    this.createNewTree('b-plus-tree')
    this.init()
    this.addButtonsEventListeners()
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
    console.log('createNewBTree')
    this.tree = undefined
    this.treeVisualizer = undefined
  }

  init() {
    this.showFanout = document.getElementById('show-fanout')
    this.speedSelector = document.getElementById('tree-speed-selector')

    this.showFanout.textContent = this.tree.fanout

    this.descreaseFanoutButton = document.getElementById(
      'decrease-fanout-button',
    )
    this.increaseFanoutButton = document.getElementById(
      'increase-fanout-button',
    )

    this.clearTreeButton = document.getElementById('clear-tree-button')

    setInterval(() => {
      console.log('tree', this.tree)
    }, 3000)

    this.treeSelector.setChangeTreeCallback(this.createNewTree.bind(this))
    ActionListener.getInstance().setCallback(data => {
      this.handleAction(data)
    })
  }

  addButtonsEventListeners() {
    this.increaseFanoutButton.addEventListener('click', e => {
      e.preventDefault()

      if (this.tree.fanout === 10) return
      this.fanout = this.fanout + 1
      this.showFanout.textContent = this.fanout
      this.createNewTree()
    })

    this.descreaseFanoutButton.addEventListener('click', e => {
      e.preventDefault()

      if (this.tree.fanout === 3) return
      this.fanout = this.fanout - 1
      this.showFanout.textContent = this.fanout
      this.createNewTree()
    })

    this.speedSelector.addEventListener('change', e => {
      e.preventDefault()

      console.log(e.target.value)
      const timeInterval = 1220 - Number(e.target.value)
      console.log(timeInterval)
      EventProcessor.getInstance().changeTimeInterval(timeInterval)
    })

    this.clearTreeButton.addEventListener('click', e => {
      e.preventDefault()
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
          const pointerUUID = uuidv4()
          this.treeKeys.add(value)
          this.tree.insert(value, pointerUUID)
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
          this.tree.delete(randomKey, null)
        }
        break
      default:
        break
    }
  }

  handleManualAction(data) {
    const { action, value } = data
    const pointerUUID = uuidv4()

    switch (action) {
      case 'insert':
        this.treeKeys.add(value)
        this.tree.insert(value, pointerUUID)
        break
      case 'search':
        this.tree.find(value)
        break
      case 'delete':
        this.treeKeys.delete(value)
        this.tree.delete(value, null)
        break
      default:
        break
    }
  }
}

window.addEventListener('load', () => {
  Controlls.getInstance()
})
