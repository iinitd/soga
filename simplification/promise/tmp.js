"use strict"

let { Notpromise } = require('./notpromise')

let p1 = new Notpromise((resolve, reject) => {
    resolve("1")
})

p1.state = "fulfilled"

p1.then((res) => {
    throw false
})