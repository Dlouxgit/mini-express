const http = require('http')
const Router = require('./router')
const methods = require('methods')

function Application () {
    this.routers = new Router()
}

methods.forEach(method => {
    Application.prototype[method] = function (path, ...handlers) {
        this.routers[method](path, handlers)
    }
})

// Application.prototype.get = function (path, ...handlers) {
//     this.routers.get(path, handlers)
// }
Application.prototype.listen = function (...args) {
    const server = http.createServer((req, res) => {
        function done() {
            res.end(`Cannot ${req.method} ${req.url}`)
        }
        // this.lazy_route()
        this.routers.handle(req, res, done)
    })
    server.listen(...args)
}

module.exports = Application