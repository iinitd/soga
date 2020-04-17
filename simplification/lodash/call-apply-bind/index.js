Function.prototype.myCall = function (context) {
    context = context ? Object(context) : window
    context.fn = this
    let args = [...arguments].slice(1)
    let r = context.fn(args)
    delete context.fn
    return r
}



Function.prototype.myApply = function (context) {
    context = context ? Object(context) : window
    context.fn = this
    let args = [...arguments][1]
    if (!args) {
        return context.fn()
    }
    let r = context.fn(args)
    delete context.fn;
    return r
}


Function.prototype.bind = function (context) {
    let _me = this
    let bindArgs = [].slice.call(arguments, 1)
    function Fn() { }
    let fBound = function () {
        let fnArgs = [].slice.call(arguments)
        return _me.apply(this instanceof fBound ? this : context, bindArgs.concat(fnArgs))
    }
    Fn.prototype = this.prototype
    fBound.prototype = new Fn();
    return fBound
}

function Animal(type) {
    this.type = type;
}
Animal.prototype.say = function () {
    console.log('say')
}

function mockNew() {
    let Constructor = [].shift.call(arguments); // 取出构造函数

    let obj = {}   // new 执行会创建一个新对象

    obj.__proto__ = Constructor.prototype

    Constructor.apply(obj, arguments)
    return obj
}
let animal = mockNew(Animal, 'dog')

console.log(animal.type) // dog
animal.say() // say

//https://juejin.im/post/5c73a602e51d457fd6235f66