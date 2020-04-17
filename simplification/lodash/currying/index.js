// ES6
function currify1(fn, ...args) {
    return function partial(...args2) {
        if (args.length + args2.length >= fn.length) {
            return fn(...args, ...args2)
        }
        return partial(fn, ...args, ...args2)
    }
}

// ES5
function currify2(fn) {
    var args = [].slice.call(arguments, 1)
    return function partial() {
        args = args.concat([].slice.call(arguments))
        if (args.length >= fn.length) {
            return fn.apply(this, args)
        }
        return partial
    }
}

function add(a, b, c) {
    return a + b + c
}

console.log(currify1(add, 2)(1, 2, 3))
