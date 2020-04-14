var fs = require('fs')


function Notmodule() {
    this.exports = {}
    this.id = ""
    this.filename = ""
    this.parent = null
}

Notmodule.prototype._cache = {}

Notmodule.prototype._resolvePath = function () {
    return '.'
}

Notmodule.prototype.load = function (filename, parent, b) {
    if (parent) {
        parent.child = this
    }

    this.parent = parent
    this.id = filename
    this.filename = filename

    var dirname = this._resolvePath()
    var data = fs.readFileSync(filename + ".js")

    var funccontent = 'function inner(notexports, notrequire, notmodule, __filename, __dirname){' + data.toString() + '}'

    eval(funccontent)

    norequire = this.notrequire.bind(this)

    inner(this.exports, norequire, this, filename, dirname)

}

Notmodule.prototype.notrequire = function (filename) {

    if (this._cache[filename]) {
        return this._cache[filename].exports
    }

    var child = new Notmodule()
    child.load(filename, this, true)

    this._cache[filename] = child

    return child.exports

}

var notmodule = new Notmodule()

notmodule.load("index", null, true)
