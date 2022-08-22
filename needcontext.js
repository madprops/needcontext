// Main object
const NeedContext = {}

// Show the menu
NeedContext.show = function (e, items) {
  if (NeedContext.container) {
    NeedContext.hide()
  }

  let x = e.clientX
  let y = e.clientY

  let container = document.createElement("div")
  container.classList.add("needcontext-container")
  
  for (let [i, item] of items.entries()) {
    let el = document.createElement("div")
    el.classList.add("needcontext-item")
    el.textContent = item.text
    el.dataset.index = i

    el.addEventListener("mouseenter", function () {
      NeedContext.select_item(parseInt(el.dataset.index))
    })

    container.append(el)
  }
  
  document.body.appendChild(container)

  if ((y + container.offsetHeight) + 5 > document.body.clientHeight) {
    y = document.body.clientHeight - container.offsetHeight - 5
  }

  if ((x + container.offsetWidth) + 5 > document.body.clientWidth) {
    x = document.body.clientWidth - container.offsetWidth - 5
  }  

  container.style.left = x
  container.style.top = y

  NeedContext.select_item(0)

  NeedContext.container = container
  NeedContext.items = items
}

// Hide the menu
NeedContext.hide = function () {
  if (NeedContext.container) {
    NeedContext.container.remove()
    NeedContext.container = undefined
    NeedContext.items = undefined
    NeedContext.index = undefined
  }
}

// Select an item by index
NeedContext.select_item = function (index) {
  let els = Array.from(document.querySelectorAll(".needcontext-item"))

  for (let [i, el] of els.entries()) {
    if (i === index) {
      el.classList.add("needcontext-item-selected")
    } else {
      el.classList.remove("needcontext-item-selected")
    }
  }

  NeedContext.index = index
}

// Select an item above
NeedContext.select_up = function () {
  NeedContext.select_item(Math.max(0, NeedContext.index - 1))
}

// Select an item below
NeedContext.select_down = function () {
  NeedContext.select_item(Math.min(NeedContext.items.length - 1, NeedContext.index + 1))
}

// Do the selected action
NeedContext.select_action = function () {
  NeedContext.items[NeedContext.index].action()
  NeedContext.hide()
}

// Prepare css and events
NeedContext.init = function () {
  let style = document.createElement("style")

  let css = `
    .needcontext-container {
      position: fixed;
      z-index: 9999999999;
      background-color: white;
      color: black;
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      gap: 3px;
      user-select: none;
      border: 3px solid #2B2F39;
      border-radius: 5px;
      cursor: pointer;
    }

    .needcontext-item {
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 3px;
      padding-bottom: 3px;
    }

    .needcontext-item-selected {
      background-color: rgba(0, 0, 0, 0.18);
    }    
  `

  style.innerHTML = css
  document.head.appendChild(style)

  document.addEventListener("mousedown", function (e) {
    if (!e.target.closest(".needcontext-container")) {
      NeedContext.hide()
    } else {
      NeedContext.select_action()
    }
  })

  document.addEventListener("keydown", function (e) {
    if (!NeedContext.container) {
      return
    }

    e.stopPropagation()
    
    if (e.key === "ArrowUp") {
      NeedContext.select_up()
    } else if (e.key === "ArrowDown") {
      NeedContext.select_down()
    } else if (e.key === "Enter") {
      NeedContext.select_action()
    }

    e.preventDefault()
  })
}

// Start
NeedContext.init()