const { VM } = require('./vm')
const { document } = require("./view")



vm = new VM("app", {
    name: "John",
    from: "Shenzhen"
})

// model -> view

vm.data.name = "Tom"
vm.data.name = "Joey"
vm.data.from = "Shanghai"

// view -> model

node = document.getElementById("name")
node.value = 'Chandler'
dispatch(node)

node = document.getElementById("from")
node.value = 'Beijing'
dispatch(node)

function dispatch(node) {
    var event = document.createEvent('Event');
    event.initEvent('input', true, true);
    node.dispatchEvent(event);
}