const express = require('express')

const app = express()

// 常用库 path-to-regexp 把路径转化成正则，和请求来的路径做匹配 获得正则

// 我的路径必须与是 /user/随意的 id/随意的名字/xxx
app.get('/user/:id/:name/xxx', function (req, res) {
    res.end(JSON.stringify(req.params))
})

let p = '/user/:id/:name/xxx/:xxx'

function pathToRegExp(str, keys) {
    str = str.replace(/:([^\/]+)/g, function () {
        keys.push(arguments[1])
        return '([^\/]+)'
    })
    console.log(str)
    return new RegExp(str)
}

let keys = []
let reg = pathToRegExp(p, keys)

// let reg = /\/user\/([^\/]+)\/([^\/]+)\/xxx/
let url = '/user/1/zf/xxx/asd'
console.log(url.match(reg).slice(1), keys)

app.listen(3000, function () {
    console.log('server start 3000')
})