// 对象的深拷贝

/*
对于简单的对象，JSON.parse(JSON.stringify(obj))。
问题：（1）慢（2）无法序列化 function regexp （3）key为symbol会被忽略（4）value为null会被忽略
这些也是手写深拷贝主要要注意的点。

*/

function deepClone(obj, hash = new WeakMap()) {
    // Do not try to clone primitives or functions
    if (Object(obj) !== obj || obj instanceof Function) return obj;
    if (hash.has(obj)) return hash.get(obj); // Cyclic reference
    try { // Try to run constructor (without arguments, as we don't know them)
        var result = new obj.constructor();
    } catch(e) { // Constructor failed, create object without running the constructor
        result = Object.create(Object.getPrototypeOf(obj));
    }
    // Optional: support for some standard constructors (extend as desired)
    if (obj instanceof Map)
        Array.from(obj, ([key, val]) => result.set(deepClone(key, hash), 
                                                   deepClone(val, hash)) );
    else if (obj instanceof Set)
        Array.from(obj, (key) => result.add(deepClone(key, hash)) );
    // Register in hash    
    hash.set(obj, result);
    // Clone and assign enumerable own properties recursively
    return Object.assign(result, ...Object.keys(obj).map (
        key => ({ [key]: deepClone(obj[key], hash) }) ));
}

// Sample data
function A() {}
function B() {}
var a = new A();
var b = new B();
a.b = b;
b.a = a;
// Test it
var c = deepClone(a);
console.log('a' in c.b.a.b); // true

//https://stackoverflow.com/questions/40291987/javascript-deep-clone-object-with-circular-references