/**
 * Essa classe é reponsável por escutar os eventos do BPlusTreeNode e
 * atualizar a visualização da árvore.
 */
class BPlusTreeNodeVisualizer {
  constructor(node) {
    this.node = node
    this.init()
  }

  init() {
    this.createElement()
    this.node.subscribe(payload => this.listenerFunction(payload))
  }

  listenerFunction(payload) {
    const { type, data } = payload

    switch (type) {
      case 'insertKey':
        this.insertKey(data)
        break
      case 'deleteKey':
        this.deleteKey(data.key.value)
        break
      case 'highlightKey':
        this.highlightKey(data.key.value)
        break
      case 'unhighlightKey':
        this.unhighlightKey(data.key.value)
        break
      default:
        break
    }
  }

  createElement() {
    this.element = document.createElement('div')
    this.element.classList.add('node')
    this.element.setAttribute('id', this.node.id)
    this.element.setAttribute('data-type', this.node.constructor.name)
  }

  insertKey(data) {
    const insertionIndex =
      data.key.index !== -1 ? data.key.index : this.node.keys.length - 1
    const keyElement = document.createElement('div')
    keyElement.classList.add('key')
    keyElement.setAttribute('data-key', data.key.value)
    keyElement.innerText = data.key.value
    this.element.insertBefore(keyElement, this.element.children[insertionIndex])
  }

  deleteKey(key) {
    const keyElement = this.element.querySelector(`[data-key="${key}"]`)
    this.element.removeChild(keyElement)
  }

  highlightKey(key) {
    const keyElement = this.element.querySelector(`[data-key="${key}"]`)
    keyElement.classList.add('highlight')
  }

  unhighlightKey(key) {
    const keyElement = this.element.querySelector(`[data-key="${key}"]`)
    keyElement.classList.remove('highlight')
  }
}

window.addEventListener('load', () => {
  const tree = new BPlusTree(7)
  const treeVisualizer = new BPlusTreeVisualizer(tree)

  tree.insert('Chave5', 'C5')
  tree.insert('Chave3', 'C3')
  tree.insert('Chave2', 'C2')
  tree.insert('Chave8', 'C8')
  tree.insert('Chave1', 'C1')
  tree.insert('Chave4', 'C4')
  tree.insert('Chave6', 'C6')
  tree.insert('Chave7', 'C7')

  console.log('aqq', tree)

  // create a BPlusTree
  // create a BPlusTreeNodeVisualizer

  // const node = new BPlusTreeNode(3)
  // const nodeVisualizer = new BPlusTreeNodeVisualizer(node)

  // append nodeVisualizer.element to the DOM

  // const container = document.getElementById('container')
  // container.appendChild(nodeVisualizer.element)
  // console.log(nodeVisualizer.element)

  // document.body.appendChild(nodeVisualizer.element)
  // insert a key

  // node.insert('Chave', {})
  // node.insert('Chave2', {})
  // node.insert('Chave3', {})
})
