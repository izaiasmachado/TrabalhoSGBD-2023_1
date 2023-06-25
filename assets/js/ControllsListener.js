class ControllsListener {
  constructor(tree) {
    this.tree = tree
    this.controlls = new Controlls()
    this.init()
  }

  init() {
    const bindedHandleButtonPress = this.handleButtonPress.bind(this)
    this.controlls.subscribe(data => {
      bindedHandleButtonPress(data)
    })
  }

  handleButtonPress(data) {
    // console.log('handleButtonPress', data)
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
    const { action, value } = data
    // console.log('handleManualAction', data)
    const pointerUUID = uuidv4()

    switch (action) {
      case 'insert':
        this.tree.insert(value, pointerUUID)
        break
      case 'search':
        this.tree.search(value, pointerUUID)
        break
      case 'delete':
        this.tree.delete(value, pointerUUID)
        break
      default:
        break
    }
  }
}
