class TreeSelector {
  constructor() {
    this.init()
  }

  static getInstance() {
    if (!TreeSelector.instance) {
      TreeSelector.instance = new TreeSelector()
    }
    return TreeSelector.instance
  }

  init() {
    this.bPlusTreeElement = document.getElementById('b-plus-button')
    this.bPlusIconElement = document.getElementById('b-plus-icon')

    this.bTreeElement = document.getElementById('b-button')
    this.bIconElement = document.getElementById('b-icon')

    this.addEventListeners()
    this.selectBPlusTree()
  }

  addEventListeners() {
    this.bPlusTreeElement.addEventListener('click', () => {
      this.selectBPlusTree()
    })

    this.bTreeElement.addEventListener('click', () => {
      this.selectBTree()
    })
  }

  getSelectedTreeType() {
    return this.treeType
  }

  setChangeTreeCallback(callback) {
    this.changeTreeCallback = callback
  }

  selectBPlusTree() {
    if (this.getSelectedTreeType === 'b-plus-tree') return
    this.treeType = 'b-plus-tree'

    this.bPlusTreeElement.classList.add('selected')
    this.bPlusIconElement.classList.add('selected')

    this.bTreeElement.classList.remove('selected')
    this.bIconElement.classList.remove('selected')

    if (this.changeTreeCallback) this.changeTreeCallback(this.treeType)
  }

  selectBTree() {
    if (this.getSelectedTreeType === 'b-tree') return
    this.treeType = 'b-tree'

    this.bTreeElement.classList.add('selected')
    this.bIconElement.classList.add('selected')

    this.bPlusTreeElement.classList.remove('selected')
    this.bPlusIconElement.classList.remove('selected')

    if (this.changeTreeCallback) this.changeTreeCallback(this.treeType)
  }
}
