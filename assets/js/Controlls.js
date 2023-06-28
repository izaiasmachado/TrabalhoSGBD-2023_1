class Controlls extends Observable {
  constructor() {
    super()
    this.init()
    this.addButtonsEventListeners()
  }

  init() {
    this.tree = new BPlusTree(4)
    this.treeVisualizer = new BPlusTreeVisualizer(this.tree)

    this.manualInputKey = document.getElementById('manual-input-key')
    this.manualInsertButton = document.getElementById('manual-insert-button')
    this.manualSearchButton = document.getElementById('manual-search-button')
    this.manualDeleteButton = document.getElementById('manual-delete-button')
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
