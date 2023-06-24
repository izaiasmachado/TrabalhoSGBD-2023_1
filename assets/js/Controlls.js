class Controlls extends Observable {
  constructor() {
    super()
    this.init()
    this.addEventListeners()
  }

  init() {
    this.manualInputKey = document.getElementById('manual-input-key')
    this.manualInsertButton = document.getElementById('manual-insert-button')
    this.manualSearchButton = document.getElementById('manual-search-button')
    this.manualDeleteButton = document.getElementById('manual-delete-button')
  }

  addEventListeners() {
    this.addEventListenersForButtons()
  }

  handleButtonPress(data) {
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

  handleManualAction(data) {
    console.log({
      type: 'manual',
      action: data.action,
      value: data.value,
    })

    this.notifyAll({
      type: 'manual',
      action: data.action,
      value: data.value,
    })
  }

  listenerManualInsertion(e) {
    e.preventDefault()

    const value = this.manualInputKey.value
    this.handleManualAction({ action: 'insert', value })
  }

  listenerManualSearch(e) {
    e.preventDefault()

    const value = this.manualInputKey.value
    this.handleManualAction({ action: 'search', value })
  }

  listenerManualDelete(e) {
    e.preventDefault()

    const value = this.manualInputKey.value
    this.handleManualAction({ action: 'delete', value })
  }

  addEventListenersForButtons() {
    this.manualInsertButton.addEventListener('click', e =>
      this.listenerManualInsertion(e),
    )

    this.manualSearchButton.addEventListener('click', e =>
      this.listenerManualSearch(e),
    )

    this.manualDeleteButton.addEventListener('click', e =>
      this.listenerManualDelete(e),
    )
  }
}
