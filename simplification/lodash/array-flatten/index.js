
var arr = [1, [2, [3, 4]]];

// 核心方法：
// mergedArray = oriArray.concat(elem1,arr1,......,arr10) 返回新的数组
// ["a","b"].concat(["c"],"d") // ["a","b","c","d"]

function flatten1(arr) {
    var result = []
    for (var i = 0, len = arr.length; i < len; i++) {
        if (Array.isArray(arr[i])) {
            result = result.concat(flatten(arr[i]))
        }
        else {
            result.push(arr[i])
        }
    }
    return result;
}

function flatten2(arr) {
    return arr.toString().split(',').map(function(item){
        return +item
    })
}

function flatten3(arr) {
    return arr.reduce(function(prev, next){
        return prev.concat(Array.isArray(next) ? flatten(next) : next)
    }, [])
}

function flatten4(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr)
    }
    return arr;
}

function flatten5(input, shallow, strict, output) {

    // 递归使用的时候会用到output
    output = output || []
    var idx = output.length

    for (var i = 0, len = input.length; i < len; i++) {

        var value = input[i]
        // 如果是数组，就进行处理
        if (Array.isArray(value)) {
            // 如果是只扁平一层，遍历该数组，依此填入 output
            if (shallow) {
                var j = 0, len = value.length
                while (j < len) output[idx++] = value[j++]
            }
            // 如果是全部扁平就递归，传入已经处理的 output，递归中接着处理 output
            else {
                flatten(value, shallow, strict, output)
                idx = output.length
            }
        }
        // 不是数组，根据 strict 的值判断是跳过不处理还是放入 output
        else if (!strict){
            output[idx++] = value
        }
    }

    return output;

}

// https://juejin.im/post/59716f15f265da6c4c500fc7