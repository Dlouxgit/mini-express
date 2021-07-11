const http = require('http')
const { url } = require('path')
let routers = [
    {
        method: 'all',
        path: '*',
        handler(req, res) {
            res.end(`Cannot ${req.method} ${req.url}`)
        }
    }
]

function createApplication() {


    return {
        get(path, handler) {
            routers.push({
                method: 'get',
                path,
                handler
            })
        },
        listen(...args) {
            const server = http.createServer(function (req, res) {
                let { pathname, query } = url.parse(req.url, true)
                let requestMethod = req.method.toLocaleLowerCase()
                for (let i = 1; i < routers.length; i++) {
                    let { method, path, handler } = routers[i]
                    if (pathname === path && method === requestMethod) {
                        return handler(req, res)
                    }
                }
                return routers[0].handler(req, res)
            })
            server.listen(...args)
        }
    }
}

module.exports = createApplication