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
  NeedContext.show({x: 100, y: 200, items: items})
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

>alt_action

Action to perform when middle clicking an item.

>on_drag

Function provided to a show function to act on drag-reorder of items.

Arguments returned: `start_index` and `end_index`.

If it is not sent items won't be draggable.