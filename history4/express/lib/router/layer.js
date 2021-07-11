function Layer(path, handler) {
    this.path = path
    this.handler = handler
}
Layer.prototype.match = function (pathname) {
    if (this.path === pathname) {
        return true
    }

    // 如果是中间件，匹配开头
    if (!this.route) {
        if (this.path === '/') {
            return true
        }
        return pathname.startsWith(this.path + '/') // 保证 /user 不会匹配到 /u，因为 /u 变成了 /u/
    }

    return false
}

Layer.prototype.handle_request = function (req, res, next) {
    console.log('this.handler', this.handler)
    return this.handler(req, res, next)
}

module.exports = Layer