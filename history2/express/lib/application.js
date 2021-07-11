const http = require('http')
const Router = require('./router')


function Application () {
    this.routers = new Router()
}
Application.prototype.get = function (path, ...handlers) {
    this.routers.get(path, handlers)
}
Application.prototype.listen = function (...args) {
    const server = http.createServer((req, res) => {
        function done() {
            res.end(`Cannot ${req.method} ${req.url}`)
        }
        return this.routers.handler(req, res, done)
    })
    server.listen(...args)
}

module.exports = Application