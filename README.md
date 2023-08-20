```javascript
let items = []

items.push({
  text: "Action 1",
  action: function () {
    console.log("Action 1 triggered")
  }
})

items.push({
  text: "Action 2",
  action: function () {
    console.log("Action 2 triggered")
  }
})

items.push({
  text: "Action 3",
  action: function () {
    console.log("Action 3 triggered")
  }
})

// Show at coordinates
document.querySelector("#button2").addEventListener("click", function (e) {
  NeedContext.show(100, 200, items)
})

// Show at element
document.querySelector("#button").addEventListener("click", function (e) {
  NeedContext.show_on_element(this, items)
})

// Show at center of window
document.querySelector("#button3").addEventListener("click", function (e) {
  NeedContext.show_center(items)
})

// Can use this to check if open
if (NeedContext.open) {
  console.log("Menu is open right now")
}

// Optional
NeedContext.after_show = function () {
  console.log("Menu is now open")
}

// Optional
NeedContext.after_hide = function () {
  console.log("Menu is now hidden")
}
```

## Additional Properties

>direct

If there's only 1 item, trigger action immidiately.