const url = require('url')

function Router() {
    this.stack = [
        {
            method: 'all',
            path: '*',
            handler(req, res) {
                res.end(`Cannot ${req.method} ${req.url}`)
            }
        }
    ]
}
Router.prototype.get = function (path, handler) { // 向路由的 stack 添加
    this.stack.push({
        path,
        method: 'get',
        handler
    })
}

Router.prototype.handler = function (req, res, done) { // 请求到来时，会匹配对应的路由处理函数
    let { pathname, query } = url.parse(req.url, true)
    let requestMethod = req.method.toLowerCase()
    for (let i = 0; i < this.stack.length; i++) {
        let { method, path, handler } = this.stack[i]
        if (method === requestMethod && pathname === path) {
            return handler(req, res)
        }
    }
    done() // 如果找不到路由，调用应用提供的 done 方法
}

module.exports = Router