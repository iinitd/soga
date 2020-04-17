class NotEvent {
    constructor() {
        this._hub = {}
    }
    on(eventName, cb) {
        let cbs = this._hub[eventName] || []
        cbs.push(cb)
        this._hub[eventName] = cbs
        return this
    }
    trigger(eventName, ...payload) {
        let cbs = this._hub[eventName] || []
        cbs.forEach(cb => {
            cb(...payload)
        })
        return this
    }
    off() {
        return this
    }
    once() {
        return this
    }
}

ev = new NotEvent()

ev.on("1", function () {
    console.log("1")
})

ev.on("1", function (a) {
    console.log("1", a)
})

ev.on("1", function (a, b) {
    console.log("1", a, b)
})

ev.trigger("1", "a", "b", "c")