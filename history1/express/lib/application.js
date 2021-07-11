const http = require('http')
const Router = require('./router')


function Application () {
    // this._routers = [
    //     {
    //         method: 'all',
    //         path: '*',
    //         handler(req, res) {
    //             res.end(`Cannot ${req.method} ${req.url}`)
    //         }
    //     }
    // ]
    this.routers = new Router()
}
Application.prototype.get = function (path, handler) {
    // this._routers.push({
    //     method: 'get',
    //     path,
    //     handler
    // })
    this.routers.get(path, handler)
}
Application.prototype.listen = function (...args) {
    // const server = http.createServer((req, res) => {
    //     const routers = this._routers
    //     let { pathname, query } = url.parse(req.url, true)
    //     let requestMethod = req.method.toLocaleLowerCase()
    //     for (let i = 1; i < routers.length; i++) {
    //         let { method, path, handler } = routers[i]
    //         if (pathname === path && method === requestMethod) {
    //             return handler(req, res)
    //         }
    //     }
    //     return routers[0].handler(req, res)
    // })
    // server.listen(...args)
    const server = http.createServer((req, res) => {
        function done() {
            res.end(`Cannot ${req.method} ${req.url}`)
        }
        return this.routers.handler(req, res, done)
    })
    server.listen(...args)
}

module.exports = Application