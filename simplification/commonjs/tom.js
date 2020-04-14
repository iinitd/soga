var jerry = notrequire('jerry')
jerry.say()
notmodule.exports = {
    name: "Tom",
    say: jerry.say
}

console.log("tom notmodule", notmodule)