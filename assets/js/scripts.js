window.addEventListener('load', () => {
  const eventProcessor = EventProcessor.getInstance()
  const eventQueue = EventQueue.getInstance()

  const tree2 = new BPlusTree(4)
  const treeVisualizer = new BPlusTreeVisualizer(tree2)
  const controllsListener = new ControllsListener(tree2)

  console.log('tree2', tree2)
  console.log(JSON.stringify(tree2, null, 2))
  // tree2.insert('12')

  // tree2.insert('Brandt')
  // tree2.insert('Califieri')
  // tree2.insert('Crick')
  // tree2.insert('Einstein')
  // tree2.insert('El Said')
  // tree2.insert('Gold')
  // tree2.insert('Katz')
  // tree2.insert('Kim')

  // tree2.insert('Mozart')
  // tree2.insert('Singh')
  // tree2.insert('Srinivasan')
  // tree2.insert('Wu')

  // tree.insert('Chave5', 'C5')
  // tree.insert('Chave3', 'C3')
  // tree.insert('Chave2', 'C2')
  // tree.insert('Chave8', 'C8')
  // tree.insert('Chave1', 'C1')
  // tree.insert('Chave4', 'C4')
  // tree.insert('Chave6', 'C6')
  // tree.insert('Chave7', 'C7')
  // tree.insert('Chave9', 'C9')

  // console.log('aqq', tree)

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
