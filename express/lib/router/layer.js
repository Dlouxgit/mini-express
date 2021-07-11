const pathToRegExp = require('path-to-regexp') // 第三方模块，express 自带

function Layer(path, handler) {
    this.path = path
    this.regexp = pathToRegExp(this.path, (this.keys = []))
    this.handler = handler
}
Layer.prototype.match = function (pathname) {
    const matches = pathname.match(this.regexp)
    if (matches) {
        this.params = this.keys.reduce((memo, key, index) => (memo[key.name] = matches[index + 1], memo), {})
        return true
    }

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