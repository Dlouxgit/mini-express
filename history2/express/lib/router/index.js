const url = require('url')
const Layer = require('./layer')
const Route = require('./route')

function Router() {
    this.stack = []
}

Router.prototype.route = function (path) {
    let route = new Route()
    let layer = new Layer(path, route.dispatch.bind(route))
    layer.route = route
    this.stack.push(layer)
    return route
}

Router.prototype.get = function (path, handlers) {
    let route = this.route(path)
    route.get(handlers)

    // this.stack.push({
    //     path,
    //     method: 'get',
    //     handler
    // })
}

Router.prototype.handler = function (req, res, done) {
    // let { pathname, query } = url.parse(req.url, true)
    // let requestMethod = req.method.toLowerCase()
    // for (let i = 0; i < this.stack.length; i++) {
    //     let { method, path, handler } = this.stack[i]
    //     if (method === requestMethod && pathname === path) {
    //         return handler(req, res)
    //     }
    // }
    // done()
}

module.exports = Router