// needcontext v1.0

// Main object
const NeedContext = {}

// Overridable function to perform after show
NeedContext.after_show = function () {}

// Overridable function to perform after hide
NeedContext.after_hide = function () {}

// Set defaults
NeedContext.set_defaults = function () {
  NeedContext.open = false
  NeedContext.keydown = false
  NeedContext.mousedown = false
  NeedContext.first_mousedown = false
  NeedContext.last_x = 0
  NeedContext.last_y = 0
}

// Show based on an element
NeedContext.show_on_element = function (el, items, number) {
  let rect = el.getBoundingClientRect()
  NeedContext.show(rect.left, rect.top, items, number)
}

// Show the menu
NeedContext.show = function (x, y, items, number = false) {
  NeedContext.hide()

  let main = document.createElement("div")
  main.id = "needcontext-main"

  let overlay = document.createElement("div")
  overlay.id = "needcontext-overlay"  

  let container = document.createElement("div")
  container.id = "needcontext-container"

  items = items.slice(0)
  
  for (let [i, item] of items.entries()) {
    let el = document.createElement("div")
    el.classList.add("needcontext-item")

    if (number) {
      el.textContent = `${i + 1}. ${item.text}`
    } else {
      el.textContent = item.text
    }

    el.dataset.index = i

    if (item.title) {
      el.title = item.title
    }

    el.addEventListener("mouseenter", function () {
      NeedContext.select_item(parseInt(el.dataset.index))
    })

    container.append(el)
  }
  
  main.append(overlay)
  main.append(container)

  main.addEventListener("contextmenu", function (e) {
    e.preventDefault()
  })

  document.body.appendChild(main)
  
  let c = document.querySelector("#needcontext-container")

  if (y < 5) {
    y = 5
  }

  if (x < 5) {
    x = 5
  }

  if ((y + c.offsetHeight) + 5 > document.body.clientHeight) {
    y = document.body.clientHeight - c.offsetHeight - 5
  }

  if ((x + c.offsetWidth) + 5 > document.body.clientWidth) {
    x = document.body.clientWidth - c.offsetWidth - 5
  }

  NeedContext.last_x = x
  NeedContext.last_y = y

  c.style.left = `${x}px`
  c.style.top = `${y}px`
  
  NeedContext.main = main
  NeedContext.items = items
  NeedContext.select_item(0)
  NeedContext.open = true
  NeedContext.after_show()
}

// Hide the menu
NeedContext.hide = function () {
  if (NeedContext.open) {
    NeedContext.main.remove()
    NeedContext.set_defaults()
    NeedContext.after_hide()
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
  let index

  if (NeedContext.index === 0) {
    index = NeedContext.items.length - 1
  } else {
    index = NeedContext.index - 1
  }
  
  NeedContext.select_item(index)
}

// Select an item below
NeedContext.select_down = function () {
  let index

  if (NeedContext.index === NeedContext.items.length - 1) {
    index = 0
  } else {
    index = NeedContext.index + 1
  }

  NeedContext.select_item(index)
}

// Do the selected action
NeedContext.select_action = async function (e) {
  let x = NeedContext.last_x
  let y = NeedContext.last_y
  let item = NeedContext.items[NeedContext.index]
  let number = item.number_items

  function show_below (items) {
    if (e.clientY) {
      y = e.clientY
    }

    NeedContext.show(x, y, items, number)
  }

  NeedContext.hide()

  if (item.action) {
    item.action(e)
  } else if (item.items) {
    show_below(item.items)
  } else if (item.get_items) {
    let items = await item.get_items()
    show_below(items)
  }
}

// Prepare css and events
NeedContext.init = function () {
  let style = document.createElement("style")

  let css = `
    #needcontext-main {
      position: fixed;
      z-index: 999999999;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }

    #needcontext-overlay {
      position: relative;
      z-index: 1;
      background-color: transparent;
    }
    
    #needcontext-container {
      z-index: 2
      position: relative;
      position: absolute;
      background-color: white;
      color: black;
      font-size: 16px;
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      gap: 3px;
      user-select: none;
      border: 1px solid #2B2F39;
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

  style.innerText = css
  document.head.appendChild(style)

  document.addEventListener("mousedown", function (e) {
    if (!NeedContext.open || !e.target) {
      return
    }
    
    NeedContext.first_mousedown = true

    if (e.target.closest("#needcontext-container")) {
      NeedContext.mousedown = true
    }
  })  

  document.addEventListener("mouseup", function (e) {
    if (!NeedContext.open || !e.target) {
      return
    }

    if (!e.target.closest("#needcontext-container")) {
      if (NeedContext.first_mousedown) {
        NeedContext.hide()
      }
    } else if (NeedContext.mousedown) {
      NeedContext.select_action(e)
    }

    NeedContext.mousedown = false
  })

  document.addEventListener("keydown", function (e) {
    if (!NeedContext.open) {
      return
    }

    e.stopPropagation()
    NeedContext.keydown = true
    
    if (e.key === "ArrowUp") {
      NeedContext.select_up()
    } else if (e.key === "ArrowDown") {
      NeedContext.select_down()
    }

    e.preventDefault()
  })

  document.addEventListener("keyup", function (e) {
    if (!NeedContext.open) {
      return
    }

    if (!NeedContext.keydown) {
      return
    }

    e.stopPropagation()
    NeedContext.keydown = false

    if (e.key === "Escape") {
      NeedContext.hide()
    } else if (e.key === "Enter") {
      NeedContext.select_action(e)
    }

    e.preventDefault()
  })

  NeedContext.set_defaults()
}

// Start
NeedContext.init()