# MVVM

- View：用户看到的界面、布局。
- View Model 是一个绑定器，实现 View 和 Model 的通信。
- Model 是数据和逻辑。

核心在于数据的双向绑定。

## 双向绑定：Model 侧

Model 侧其实就是纯粹的 JS 代码。相对来说比较直观。其核心在于「如何截获变量的更新，并及时通知给用这个变量的人」。

JS 中的 Object.defineProperty 和 Proxy 都可以帮我们实现这一点。

首先看一下 Object.defineProperty 的基本用法。通过 get 和 set 方法，可以劫持数据的读写。

    var obj = { name: "John" }
    Object.defineProperty(obj, "message", {
        get: function () {
            return "Hello " + val
        },
        set: function (newVal) {
            val = newVal
        }
    });
    
    obj.name // Dear John
    obj.name = "Jane"
    obj.name // Dear JANE

有了这个，我们就可以实现一个简单的版本。

- 递归，把原始对象里的每一个属性赋值到 vm 中，并进行「劫持」。
- 在 set 里面执行「通知」。

这是这一阶段的代码。

    var obj = { name: "John" }
    var vm = {} // 当然，你也可以在原对象上进行修改。
    observe(obj, this, vm)
    
    function observe(obj, vm){
    	Object.keys(obj).forEach(function (key) {
          defineReactive(vm, key, obj[key]);
      });
    }
    
    function defineReactive (obj, key, val) {
        Object.defineProperty(obj, key, {
            get: function () {
    						// 这里应该保存所有使用这个属性的人。
                return val
            },
            set: function (newVal) {
                if (newVal === val) return
                val = newVal;
                // 这里应该通知所有使用这个属性的人。
            }
        });
    }

在完成了数据劫持之后，我们就可以开始考虑如何设计这一套「订阅通知」，在 vue 中被称为「依赖管理」。在这里，先引入几个概念：

- Dep：依赖管理器
- sub（subscriber）：订阅者

以下是一个 runnable 的简单实现。这段代码里，个人觉得最 tricky 的地方在于 GLOBAL_CURRENT_SUB 的使用。具体看代码。

    var obj = { name: "John" }
    var vm = {} // 当然，你也可以在原对象上进行修改。
    observe(obj, vm)
    new Subscriber(vm, null, "name")
    vm.name = "Tom"
    vm.name = "Joey"
    
    function observe(obj, vm) {
        Object.keys(obj).forEach(function (key) {
            defineReactive(vm, key, obj[key]);
        });
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
    		// 设置一个全局变量，使得 get 的时候可以截获到当前的订阅者。
        GLOBAL_CURRENT_SUB = this
        this.update = update
        this.key = key
        this.node = node
        this.vm = vm
        this.value = vm[key] // 触发 get，使其保存当前的订阅者。
        GLOBAL_CURRENT_SUB = null
    }
    
    function update() {
        this.value = this.vm[this.key]
        if (this.node) {
            this.node.nodeValue = this.value;
        } else {
            console.log("i know my new name: " + this.value)
        }
    }

## 双向绑定：View 侧

View 侧的核心任务在于「如何解析 HTML，并调用相应的订阅」。

其基本实现应该是这样的。

    compile(HTMLStr)
    
    function compile(){
    	// if v-model exists, 
      // 1. create a subscriber.
      // 2. addEventListener, set data to vm.
    }

## 完整实现

[https://github.com/iinitd/mvvm](https://github.com/iinitd/mvvm)

---

### 感谢

- 比较整洁的代码：[https://juejin.im/post/5b2f0769e51d45589f46949e](https://juejin.im/post/5b2f0769e51d45589f46949e)
- 代码解析：[https://juejin.im/post/5adf0085518825673123da9a](https://juejin.im/post/5adf0085518825673123da9a)
- 解析：[https://zhuanlan.zhihu.com/p/28838074](https://zhuanlan.zhihu.com/p/28838074)