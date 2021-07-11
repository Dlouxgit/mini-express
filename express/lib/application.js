const http = require('http')
const methods = require('methods')
const fs = require('fs')
const Router = require('./router')

function Application () {
    // this.router = new Router()
}

methods.forEach(method => {
    Application.prototype[method] = function (path, ...handlers) {
        this.router[method](path, handlers)
    }
})

Application.prototype.lazy_route = function () {
    if (!this.router) {
        this.router = new Router()
        this.use((req, res, next) => {
            res.send = function (data) {
                if (typeof data === 'object') {
                    res.end(JSON.stringify(data))
                } else if (typeof data === 'string' || Buffer.isBuffer(data)) {
                    res.end(data)
                }
            }
            res.sendFile = function (filePath) {
                // res.write('<head><meta charset="utf-8"/></head>')
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                fs.createReadStream(filePath, {
                    encoding:'utf8' //默认null
                }).pipe(res)
            }
            next()
        })
    }
}
Application.prototype.param = function () {
    this.lazy_route()
    this.router.param(...arguments)
}

Application.prototype.use = function () {
    this.lazy_route()
    this.router.use(...arguments)
}
Application.prototype.listen = function (...args) {
    const server = http.createServer((req, res) => {
        function done() {
            res.end(`Cannot ${req.method} ${req.url}`)
        }
        this.lazy_route()
        this.router.handle(req, res, done)
    })
    server.listen(...args)
}

module.exports = Application