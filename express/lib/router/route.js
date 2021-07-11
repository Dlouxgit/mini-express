const Layer = require('./layer')
const methods = require('methods')

function Route() {
    this.stack = []
    this.methods = {}
}

Route.prototype.dispatch = function (req, res, out) {
    let i = 0
    let next = () => {
        
        console.log('是否进来')
        if (i === this.stack.length) return out()
        let layer = this.stack[i++]
        if (layer.method === req.method.toLowerCase()) {
            layer.handler(req, res, next) // 用户注册的回调
        } else {
            next()
        }
    }
    next()
}

methods.forEach(method => {
    Route.prototype[method] = function (handlers) {
        handlers.forEach(handler => {
            let layer = new Layer('/', handler)
            this.methods[method] = true // 给每个方法都

            layer.method = method // 给每一层都添加一个方法
            this.stack.push(layer)
        })
    }
})


module.exports = Route