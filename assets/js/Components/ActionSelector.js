class ActionSelector {
  constructor() {
    this.init()
    this.adddEventListeners()
    this.handleManual()
  }

  static getInstance() {
    if (!ActionSelector.instance) {
      ActionSelector.instance = new ActionSelector()
    }

    return ActionSelector.instance
  }

  init() {
    this.selectInputManual = document.querySelector('#select-input-manual')
    this.selectInsertRandom = document.querySelector('#select-insert-random')
    this.selectDeleteRandom = document.querySelector('#select-delete-random')

    this.manualInputBar = document.querySelector('#manual-container')
    this.randomInsertBar = document.querySelector('#random-insert-container')
    this.randomDeleteBar = document.querySelector('#random-delete-container')
  }

  hideAll() {
    this.manualInputBar.style.display = 'none'
    this.randomInsertBar.style.display = 'none'
    this.randomDeleteBar.style.display = 'none'

    this.selectInputManual.classList.remove('selected')
    this.selectInsertRandom.classList.remove('selected')
    this.selectDeleteRandom.classList.remove('selected')
    BottomBar.getInstance().hide()
  }

  adddEventListeners() {
    this.selectInputManual.addEventListener('click', () => {
      this.handleManual()
    })

    this.selectInsertRandom.addEventListener('click', () => {
      this.handleInsertRandom()
    })

    this.selectDeleteRandom.addEventListener('click', () => {
      this.handleDeleteRandom()
    })
  }

  handleManual() {
    if (this.type === 'manual') return
    this.hideAll()

    this.type = 'manual'
    this.selectInputManual.classList.add('selected')
    this.manualInputBar.style.display = 'flex'
  }

  handleInsertRandom() {
    if (this.type === 'insert-random') return
    this.hideAll()

    this.type = 'insert-random'
    BottomBar.getInstance().show()
    this.selectInsertRandom.classList.add('selected')
    this.randomInsertBar.style.display = 'flex'
  }

  handleDeleteRandom() {
    if (this.type === 'delete-random') return
    this.hideAll()

    this.type = 'delete-random'
    BottomBar.getInstance().show()
    this.selectDeleteRandom.classList.add('selected')
    this.randomDeleteBar.style.display = 'flex'
  }
}

window.addEventListener('load', function () {
  ActionSelector.getInstance()
})
