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
    console.log('args', args)
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
    const next = () => {
        if (i == this.stack.length) return done()
        let layer = this.stack[i++]
        if (layer.match(pathname)) { // 匹配路由与中间件
            if (!layer.route) { // 中间件不需要匹配方法
                layer.handle_request(req, res, next)
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