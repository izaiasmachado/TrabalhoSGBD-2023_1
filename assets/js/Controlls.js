class Controlls extends Observable {
  constructor() {
    super()
    this.createTree()
    this.init()
    this.addButtonsEventListeners()
    this.fanout = 4
  }

  createTree() {
    this.tree = new BPlusTree(4)
    this.treeVisualizer = new BPlusTreeVisualizer(this.tree)
  }

  createNewTree() {
    this.treeVisualizer.clear()
    this.tree = new BPlusTree(this.fanout)
    this.treeVisualizer = new BPlusTreeVisualizer(this.tree)
  }

  init() {
    this.manualInputKey = document.getElementById('manual-input-key')
    this.manualInsertButton = document.getElementById('manual-insert-button')
    this.manualSearchButton = document.getElementById('manual-search-button')
    this.manualDeleteButton = document.getElementById('manual-delete-button')

    this.randomInputStart = document.getElementById('random-input-start')
    this.randomInputEnd = document.getElementById('random-input-end')
    this.randomInputCount = document.getElementById('random-input-count')
    this.randomInsertButton = document.getElementById('random-insert-button')
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
  }

  addButtonsEventListeners() {
    this.manualInsertButton.addEventListener('click', e => {
      e.preventDefault()

      const value = this.manualInputKey.value
      this.handleManualAction({ action: 'insert', value })
    })

    this.manualSearchButton.addEventListener('click', e => {
      e.preventDefault()

      const value = this.manualInputKey.value
      this.handleManualAction({ action: 'search', value })
    })

    this.manualDeleteButton.addEventListener('click', e => {
      e.preventDefault()

      const value = this.manualInputKey.value
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

      const start = Number(this.randomInputStart.value)
      const end = Number(this.randomInputEnd.value)
      const count = Number(this.randomInputCount.value)

      console.log(start, end, count)
      this.handleRandomAction({ action: 'insert', start, end, count })
    })

    this.randomDeleteButton.addEventListener('click', e => {
      e.preventDefault()

      const start = Number(this.randomInputStart.value)
      const end = Number(this.randomInputEnd.value)
      const count = Number(this.randomInputCount.value)

      this.handleRandomAction({ action: 'delete', start, end, count })
    })
  }

  handleRandomAction(data) {
    const { action, start, end, count } = data
    const randomNumbers = generateRandomNumbers(start, end, count)

    switch (action) {
      case 'insert':
        randomNumbers.forEach(value => {
          const pointerUUID = uuidv4()
          this.tree.insert(value, pointerUUID)
        })
        break
      case 'delete':
        randomNumbers.forEach(value => {
          this.tree.delete(value)
        })
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
        this.tree.insert(value, pointerUUID)
        break
      case 'search':
        this.tree.find(value)
        break
      case 'delete':
        this.tree.delete(value)
        break
      default:
        break
    }
  }
}
