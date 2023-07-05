window.addEventListener('load', function () {
  const selectInputManual = document.querySelector('#select-input-manual')
  const selectInsertRandom = document.querySelector('#select-insert-random')
  const selectDeleteRandom = document.querySelector('#select-delete-random')

  const manualInputBar = document.querySelector('#manual-container')
  const randomInsertBar = document.querySelector('#random-insert-container')
  const randomDeleteBar = document.querySelector('#random-delete-container')

  const bottomBar = BottomBar.getInstance()

  selectInputManual.addEventListener('click', function () {
    selectInputManual.classList.add('selected')
    selectInsertRandom.classList.remove('selected')
    selectDeleteRandom.classList.remove('selected')

    manualInputBar.style.display = 'flex'
    randomInsertBar.style.display = 'none'
    randomDeleteBar.style.display = 'none'
    bottomBar.hide()
  })

  selectInsertRandom.addEventListener('click', function () {
    selectInsertRandom.classList.add('selected')
    selectInputManual.classList.remove('selected')
    selectDeleteRandom.classList.remove('selected')

    randomInsertBar.style.display = 'flex'
    manualInputBar.style.display = 'none'
    randomDeleteBar.style.display = 'none'
    bottomBar.show()
  })

  selectDeleteRandom.addEventListener('click', function () {
    selectDeleteRandom.classList.add('selected')
    selectInsertRandom.classList.remove('selected')
    selectInputManual.classList.remove('selected')

    randomDeleteBar.style.display = 'flex'
    manualInputBar.style.display = 'none'
    randomInsertBar.style.display = 'none'
    bottomBar.show()
  })
})
