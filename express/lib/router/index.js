const url = require('url')
const Layer = require('./layer')
const Route = require('./route')
const methods = require('methods')

function Router() {
    let router = function (req, res, next) {
        router.handle(req, res, next) // 请求来了，从栈中匹配
    }
    router.stack = []
    router.__proto__ = proto // 能 new 能执行，new 与 执行都返回的是一个函数
}

let proto = {}

proto.route = function (path) {
    let route = new Route()
    let layer = new Layer(path, route.dispatch.bind(route))
    layer.route = route
    this.stack.push(layer)
    return route
}

proto.use = function (path) {
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
    proto[method] = function (path, handlers) {
        if (!Array.isArray(handlers)) {
            handlers = Array.from(arguments).slice(1)
        }
        let route = this.route(path)
        route[method](handlers)
    }
})

proto.handle = function (req, res, done) {
    // 在路由的栈中查找，找不到就找下一个
    const { pathname } = url.parse(req.url)
    const method = req.method.toLowerCase()
    let i = 0
    let removed = ''
    const next = (err) => {
        if (i == this.stack.length) return done()
        let layer = this.stack[i++]

        if (removed.length) {
            req.url = removed + req.url
            removed = ''
        }

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
        } else {
            if (layer.match(pathname)) { // 匹配路由与中间件
                // route.params = layer.params
                if (!layer.route) { // 中间件不需要匹配方法
                    console.log('layer', layer)
                    if (layer.handler.length === 4) {
                        next()
                    } else {
                        // 匹配到中间件的时候需要删除中间件的前缀， 如果中间件是 / 就不用删除
                        if (layer.path !== '/') {
                            removed = layer.path
                            req.url = req.url.slice(removed.length)
                        }
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
    }
    next()
}

module.exports = Router