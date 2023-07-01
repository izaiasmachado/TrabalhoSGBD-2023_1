class BTreeControlls extends Observable {
  constructor() {
    super()
    this.createTree()
    this.init()
    this.addButtonsEventListeners()
    this.fanout = 4
    this.treeKeys = new Set()
  }

  createTree() {}
  init() {}
  addButtonsEventListeners() {}
}
