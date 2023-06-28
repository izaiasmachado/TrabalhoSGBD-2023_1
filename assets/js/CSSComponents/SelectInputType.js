window.addEventListener('load', function () {
  const selectInputManual = document.querySelector('#select-input-manual')
  const selectInputRandom = document.querySelector('#select-input-random')
  const manualInputBar = document.querySelector('#manual-container')
  const randomInputBar = document.querySelector('#random-container')

  selectInputManual.addEventListener('click', function () {
    console.log('selectInputManual')
    selectInputManual.classList.add('selected')
    selectInputRandom.classList.remove('selected')
    manualInputBar.style.display = 'block'
    randomInputBar.style.display = 'none'
  })

  selectInputRandom.addEventListener('click', function () {
    selectInputRandom.classList.add('selected')
    selectInputManual.classList.remove('selected')
    randomInputBar.style.display = 'block'
    manualInputBar.style.display = 'none'
  })
})
