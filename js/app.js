import { v4 as uuidv4 } from "https://jspm.dev/uuid"

const form = document.querySelector(".js-add-music-cd-form")
const inputAuthor = document.querySelector(".js-input-author")
const inputTitle = document.querySelector(".js-input-title")
const inputYear = document.querySelector(".js-input-year")
const tableBody = document.querySelector(".js-table-body")
const templateTableItem = document.querySelector(".t-table-item").content

const DATE_TODAY = new Date()
const AUTHOR_MIN_LENGTH = 2
const TITLE_MIN_LENGTH = 2
const YEAR_MAX_LENGTH = DATE_TODAY.getFullYear()

const items = []

form.addEventListener("submit", handleMusicCDs)

function handleMusicCDs(event) {
  event.preventDefault()
  hideErrors()
  const { author, title, year } = getUserInputs()
  const { isFormValid, errors } = getFormState(author, title, year)

  if (isFormValid) {
    addItem(author, title, year)
    displayList()
  } else {
    displayErrors(errors)
  }
}

function displayList() {
  tableBody.innerHTML = ""
  if (items) items.forEach((item) => displayItem(item))
}

function getFormState(author, title, year) {
  const errors = []
  let isFormValid = true

  if (author.length < AUTHOR_MIN_LENGTH) {
    errors.push({
      target: inputAuthor,
      message: "Author must be at least 2 characters long",
    })
    isFormValid = false
  }

  if (title.length < TITLE_MIN_LENGTH) {
    errors.push({
      target: inputTitle,
      message: "Title must be at least 2 characters long",
    })
    isFormValid = false
  }

  if (year > YEAR_MAX_LENGTH) {
    errors.push({
      target: inputYear,
      message: "Year cannot be in the future",
    })
    isFormValid = false
  }

  return { isFormValid: isFormValid, errors: errors }
}

function displayErrors(errors) {
  errors.forEach((error) => {
    const errorBox = error.target.nextElementSibling
    errorBox.textContent = error.message
    errorBox.classList.remove("is-hidden")
  })
}

function hideErrors() {
  const errorBoxes = form.querySelectorAll(".c-error")
  errorBoxes.forEach((box) => {
    box.textContent = ""
    box.classList.add("is-hidden")
  })
}

function getUserInputs() {
  const author = inputAuthor.value
  const title = inputTitle.value
  const year = parseFloat(inputYear.value)

  return { author, title, year }
}

function addItem(author, title, year) {
  const item = {
    id: uuidv4(),
    author: author,
    title: title,
    year: year,
  }

  items.push(item)
}

function displayItem(item) {
  const templateClone = templateTableItem.cloneNode(true)
  const { id, author, title, year } = item

  templateClone.querySelector("[data-author]").textContent = author
  templateClone.querySelector("[data-title]").textContent = title
  templateClone.querySelector("[data-year]").textContent = year
  templateClone.querySelector("[data-delete-button]").addEventListener("click", deleteItem)

  tableBody.append(templateClone)

  function deleteItem() {
    const index = items.findIndex((item) => item.id === id)
    items.pop(index)

    displayList()
  }
}
