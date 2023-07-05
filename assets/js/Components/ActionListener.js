class ActionListener {
  constructor() {
    this.init()
    this.addEventListeners()
  }

  static getInstance() {
    if (!ActionListener.instance) {
      ActionListener.instance = new ActionListener()
    }

    return ActionListener.instance
  }

  init() {
    // Ações manuais
    this.manualInputKey = document.getElementById('manual-input-key')
    this.manualInsertButton = document.getElementById('manual-insert-button')
    this.manualSearchButton = document.getElementById('manual-search-button')
    this.manualDeleteButton = document.getElementById('manual-delete-button')

    // Inserção aleatória
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

    // Deleção aleatória
    this.randomDeletionInputCount = document.getElementById(
      'random-deletion-input-count',
    )
    this.randomDeleteButton = document.getElementById('random-delete-button')
  }

  setCallback(callback) {
    this.callback = callback
  }

  addEventListeners() {
    // Ações manuais
    this.manualInsertButton.addEventListener('click', e => {
      e.preventDefault()

      const value = this.manualInputKey.value
      this.callback({
        type: 'manual',
        action: 'insert',
        value,
      })
    })

    this.manualSearchButton.addEventListener('click', e => {
      e.preventDefault()

      const value = parseNumberIfPossible(this.manualInputKey.value)
      this.callback({
        type: 'manual',
        action: 'search',
        value,
      })
    })

    this.manualDeleteButton.addEventListener('click', e => {
      e.preventDefault()

      const value = parseNumberIfPossible(this.manualInputKey.value)
      this.callback({
        type: 'manual',
        action: 'delete',
        value,
      })
    })

    // Inserção aleatória
    this.randomInsertButton.addEventListener('click', e => {
      e.preventDefault()

      const start = Number(this.randomInsertionInputStart.value)
      const end = Number(this.randomInsertionInputEnd.value)
      const count = Number(this.randomInsertionInputCount.value)

      this.callback({
        type: 'random',
        action: 'insert',
        start,
        end,
        count,
      })
    })

    // Deleção aleatória
    this.randomDeleteButton.addEventListener('click', e => {
      e.preventDefault()
      const count = Number(this.randomDeletionInputCount.value)
      this.callback({
        type: 'random',
        action: 'delete',
        count,
      })
    })
  }
}
