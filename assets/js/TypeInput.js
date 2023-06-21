function handleTypeInput() {
  const typeNode = document.getElementById('typeNode')
  const typeNodeStatus = typeNode.checked
  const randomInput = document.getElementById('random-container')
  const manualInput = document.getElementById('manual-container')

  if (typeNodeStatus) {
    manualInput.style.display = 'none'
    randomInput.style.display = 'flex'
  } else {
    randomInput.style.display = 'none'
    manualInput.style.display = 'flex'
  }
}
