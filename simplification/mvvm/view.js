const { JSDOM } = require("jsdom")

const dom = new JSDOM(`<!DOCTYPE html>
<div id="app">
    <input id="name" v-model="name"></input>
    <input id="from" v-model="from"></input>
</div>`
);

const document = dom.window.document

module.exports = {
    document: document
}