```javascript
let el = document.querySelector("#button")

el.addEventListener("click", function (e) {
  let items = []

  items.push({
    text: "Action 1",
    action: function () {
      console.log("aaaaaaa")
    }
  })

  items.push({
    text: "Action 2",
    action: function () {
      console.log("bbbbbbbbb")
    }
  })    

  items.push({
    text: "Action 3",
    action: function () {
      console.log("cccccc")
    }
  })

  NeedContext.show(e, items)
})
```