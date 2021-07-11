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
Router.prototype.get = function (path, handler) {
    this.stack.push({
        path,
        method: 'get',
        handler
    })
}

Router.prototype.handler = function (req, res, done) {
    let { pathname, query } = url.parse(req.url, true)
    let requestMethod = req.method.toLowerCase()
    for (let i = 0; i < this.stack.length; i++) {
        let { method, path, handler } = this.stack[i]
        if (method === requestMethod && pathname === path) {
            return handler(req, res)
        }
    }
    done()
}

module.exports = Router