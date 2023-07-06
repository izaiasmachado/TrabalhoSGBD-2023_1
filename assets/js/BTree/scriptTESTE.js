let b = new BTree(5)
// let raiz = new BTreeNode(5)
// b.root = raiz
// raiz.keys.push(90)

// let no1 = new BTreeNode(5)
// no1.keys = [30, 60]
// let no2 = new BTreeNode(5)
// no2.keys = [120, 150]

// raiz.pointers.push(no1)
// raiz.pointers.push(no2)

// let folha1 = new BTreeNode(5)
// folha1.keys = [10, 20]
// let folha2 = new BTreeNode(5)
// folha2.keys = [40, 50]
// let folha3 = new BTreeNode(5)
// folha3.keys = [70, 80]
// let folha4 = new BTreeNode(5)
// folha4.keys = [100, 110]
// let folha5 = new BTreeNode(5)
// folha5.keys = [130, 140]
// let folha6 = new BTreeNode(5)
// folha6.keys = [160, 170]

// no1.pointers.push(folha1)
// no1.pointers.push(folha2)
// no1.pointers.push(folha3)

// no2.pointers.push(folha4)
// no2.pointers.push(folha5)
// no2.pointers.push(folha6)

// let nodelevel = b.getNodeLevel(folha1)

// console.log('===========')
// console.log(nodelevel)
// console.log('===========')

// let bplus = new BPlusTree(5)
// bplus.insert(4, uuidv4())
// console.log(bplus)

b.insert(11)
b.insert(36)
b.insert(53)
b.insert(95)
b.insert(8)
b.insert(12)
b.insert(13)
b.insert(14)
b.insert(15)
b.insert(16)
b.insert(17)
b.insert(18)
b.insert(19)
b.insert(20)
b.insert(21)
b.insert(22)
b.insert(23)

// // for (var i = 1; i <= 30; i++) {
// //   b.insert(i)
// // }

console.log(b)

// let no = new BTreeNode(4)
// no.insert(1, 'pointer 1')
// no.insert(2, 'pointer 2')
// no.insert(3, 'pointer 3')
// no.insert(4, 'pointer 4')
// no.insert(5, 'pointer 5')
// no.insert(4, 'pointer 4')
// no.insert(5, 'pointer 5')
// no.pointers.push('pointer 5')

// let no2 = new BTreeNode(5)

// console.log(JSON.stringify(no))
// console.log(JSON.stringify(no2))

// no.split(no2)
// console.log('================')
// console.log(JSON.stringify(no))
// console.log(JSON.stringify(no2))

// let func = value => {
//   console.log(value.key)
//   console.log(value.pointer)
// }

// func({ key: 1, pointer: 3333 })
