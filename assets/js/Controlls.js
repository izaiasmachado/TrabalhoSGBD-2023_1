class Controlls extends Observable {
  constructor() {
    super()
    this.fanout = 4
    this.treeKeys = new Set()
    this.createNewTree()
    this.init()
    this.addButtonsEventListeners()
  }

  createNewTree() {
    if (this.treeVisualizer) this.treeVisualizer.clear()
    this.tree = new BPlusTree(this.fanout)
    this.treeVisualizer = new BPlusTreeVisualizer(this.tree)
    BottomBar.getInstance().reset()
  }

  init() {
    this.manualInputKey = document.getElementById('manual-input-key')
    this.manualInsertButton = document.getElementById('manual-insert-button')
    this.manualSearchButton = document.getElementById('manual-search-button')
    this.manualDeleteButton = document.getElementById('manual-delete-button')

    this.randomInsertionInputStart = document.getElementById(
      'random-insert-input-start',
    )
    this.randomInsertionInputEnd = document.getElementById(
      'random-insert-input-end',
    )
    this.randomInsertionInputCount = document.getElementById(
      'random-insert-input-count',
    )
    this.randomInsertButton = document.getElementById('random-insert-button')

    this.randomDeletionInputCount = document.getElementById(
      'random-deletion-input-count',
    )
    this.randomDeleteButton = document.getElementById('random-delete-button')

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
  }

  addButtonsEventListeners() {
    this.manualInsertButton.addEventListener('click', e => {
      e.preventDefault()

      const value = this.manualInputKey.value
      this.handleManualAction({ action: 'insert', value })
    })

    this.manualSearchButton.addEventListener('click', e => {
      e.preventDefault()

      const value = parseNumberIfPossible(this.manualInputKey.value)
      this.handleManualAction({ action: 'search', value })
    })

    this.manualDeleteButton.addEventListener('click', e => {
      e.preventDefault()

      const value = parseNumberIfPossible(this.manualInputKey.value)
      this.handleManualAction({ action: 'delete', value })
    })

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

    this.randomInsertButton.addEventListener('click', e => {
      e.preventDefault()

      const start = Number(this.randomInsertionInputStart.value)
      const end = Number(this.randomInsertionInputEnd.value)
      const count = Number(this.randomInsertionInputCount.value)

      console.log(start, end, count)
      this.handleRandomAction({ action: 'insert', start, end, count })
    })

    this.randomDeleteButton.addEventListener('click', e => {
      e.preventDefault()
      const count = Number(this.randomDeletionInputCount.value)
      this.handleRandomAction({ action: 'delete', count })
    })

    this.clearTreeButton.addEventListener('click', e => {
      e.preventDefault()
      this.createNewTree()
    })
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
