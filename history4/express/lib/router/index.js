const url = require('url')
const Layer = require('./layer')
const Route = require('./route')
const methods = require('methods')

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

Router.prototype.use = function (path) {
    // console.log(path, handlers)
    let args = Array.from(arguments)
    let handlers = []
    if (typeof path === 'function') {
        path = '/'
        handlers = [...args]
    } else {
        handlers = args.slice(1)
    }
    handlers.forEach(handler => {
        let layer = new Layer(path, handler)
        layer.route = undefined
        this.stack.push(layer)
    })
    console.log(path, handlers)
}

methods.forEach(method => {
    Router.prototype[method] = function (path, handlers) {
        let route = this.route(path)
        route[method](handlers)
    }
})

Router.prototype.handle = function (req, res, done) {
    // 在路由的栈中查找，找不到就找下一个
    const { pathname } = url.parse(req.url)
    const method = req.method.toLowerCase()
    let i = 0
    const next = (err) => {
        if (i == this.stack.length) return done()
        let layer = this.stack[i++]

        // 错误处理中间件
        if (err) {
            if (!layer.route) {
                if (layer.handler.length === 4) {
                    layer.handler(err, req, res, next)
                } else {
                    next(err)
                }
            } else {
                next(err)
            }
        } else if (layer.match(pathname)) { // 匹配路由与中间件
            if (!layer.route) { // 中间件不需要匹配方法
                console.log('layer', layer)
                if (layer.handler.length === 4) {
                    next()
                } else {
                    layer.handle_request(req, res, next)
                }
            } else {
                if (layer.route.methods[method]) {
                    layer.handle_request(req, res, next)
                } else {
                    next()
                }
            }
        } else {
            next()
        }
    }
    next()
}

module.exports = Router