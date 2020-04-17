//希望频繁事件的回调函数在某段连续时间内，在事件触发后只执行一次。

function debounce(fn, delay) {

    var timer

    return function () {
        var context = this
        var args = arguments

        clearTimeout(timer)

        timer = setTimeout(function () {
            fn.apply(context, args)
        }, delay)
    }

}