function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  )
}

function createArrayObserver(array, onSizeChange) {
  return new Proxy(array, {
    set(target, property, value, receiver) {
      const oldLength = target.length
      const result = Reflect.set(target, property, value, receiver)
      const newLength = target.length

      if (oldLength !== newLength) {
        onSizeChange(newLength)
      }

      return result
    },
  })
}

function isLower(a, b) {
  const parsedA = Number(a)
  const parsedB = Number(b)

  if (!isNaN(parsedA) && !isNaN(parsedB)) {
    return parsedA < parsedB
  }

  if (typeof a === 'string' && typeof b === 'string') {
    return a < b
  }

  return false
}

function isLowerOrEqual(a, b) {
  const parsedA = Number(a)
  const parsedB = Number(b)

  if (!isNaN(parsedA) && !isNaN(parsedB)) {
    return parsedA <= parsedB
  }

  if (typeof a === 'string' && typeof b === 'string') {
    return a <= b
  }

  return false
}

function generateRandomUniqueNumbers(start, end, count) {
  const randomNumbers = []
  if (end - start + 1 < count) return null

  while (randomNumbers.length < count) {
    const randomNumber = Math.floor(Math.random() * (end - start + 1)) + start

    if (randomNumbers.includes(randomNumber)) continue
    randomNumbers.push(randomNumber)
  }

  return randomNumbers
}

class Observable {
  constructor() {
    this.observers = []
  }

  subscribe(f) {
    this.observers.push(f)
  }

  unsubscribe(f) {
    this.observers = this.observers.filter(subscriber => subscriber !== f)
  }

  notifyAll(data) {
    this.observers.forEach(observer => observer(data))
  }
}
