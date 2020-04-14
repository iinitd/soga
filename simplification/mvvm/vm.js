const { document } = require("./view")

// var obj = { name: "John" }
// var vm = {} // 当然，你也可以在原对象上进行修改。
// observe(obj, vm)
// new Subscriber(vm, null, "name")
// vm.name = "Tom"
// vm.name = "Joey"

GLOBAL_CURRENT_SUB = null

function observe(obj, vm) {
    Object.keys(obj).forEach(function (key) {
        defineReactive(vm, key, obj[key]);
    });
    return vm
}

function defineReactive(obj, key, val) {
    dep = new Dep() // 我们使用闭包来保存当前属性的依赖方。
    Object.defineProperty(obj, key, {
        get: function () {
            // 这里应该保存所有使用这个属性的人。
            if (GLOBAL_CURRENT_SUB) dep.addSub(GLOBAL_CURRENT_SUB)
            return val
        },
        set: function (newVal) {
            if (newVal === val) return
            val = newVal;
            // 这里应该通知所有使用这个属性的人。
            dep.notify()
        }
    });
}

function Dep() {
    this.subs = []
    this.notify = () => {
        for (let i = 0; i < this.subs.length; i += 1) {
            this.subs[i].update()
        }
    }
    this.addSub = (sub) => {
        this.subs.push(sub)
    }
}

function Subscriber(vm, node, key) {
    GLOBAL_CURRENT_SUB = this
    this.update = update
    this.key = key
    this.node = node
    this.vm = vm
    this.value = vm[key]
    GLOBAL_CURRENT_SUB = null
}

function update() {
    this.value = this.vm[this.key]
    if (this.node) {
        this.node.nodeValue = this.value;
        console.log("node got notified: " + this.value)
    } else {
        console.log("node got notified: " + this.value)
    }
}

function compile(vm, node) {
    if (!node.attributes) return
    Array.prototype.slice.call(node.attributes).forEach((attr) => {
        let name = attr.name
        let value = attr.value
        if (name == 'v-model') {
            if (value && vm.data[value]) {
                new Subscriber(vm.data, node, value)
                node.addEventListener('input', function (e) {
                    vm.data[value] = e.target.value
                }, false);
            }
        }
    })
    compileChildren(vm, node)
}

function compileChildren(vm, node) {
    let children = node.childNodes
    if (!children) return
    node.childNodes.forEach(function (child) {
        compile(vm, child)
    })
}

function VM(el, obj) {
    this.el = el
    this.data = observe(obj, {})
    let node = document.getElementById(el)
    compile(this, node)
}

module.exports = {
    VM: VM
}