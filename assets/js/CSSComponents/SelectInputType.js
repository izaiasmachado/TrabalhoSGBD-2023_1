window.addEventListener('load', function () {
  console.log('SelectInputType.js loaded')
  const selectInputManual = document.querySelector('#select-input-manual')
  const selectInputRandom = document.querySelector('#select-input-random')

  selectInputManual.addEventListener('click', function () {
    console.log('selectInputManual')
    selectInputManual.classList.add('selected')
    selectInputRandom.classList.remove('selected')
  })

  selectInputRandom.addEventListener('click', function () {
    selectInputRandom.classList.add('selected')
    selectInputManual.classList.remove('selected')
  })
})
