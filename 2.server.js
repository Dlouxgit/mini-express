const express = require('./express')

const app = express()


// 路由中间件功能
// 例如当我访问 / 的时候，需要判断用户权限，如果是某个权限做某件事 =》 返回最终相应结果
function fn(req, res, next) {
    if (req.query.auth === '1') {
        next()
    } else {
        res.end('no auth')
    }
}
app.get('/', fn, function (req, res, next) {
    console.log(1)
    next()
    console.log('5')
}, function (req, res, next) {
    console.log(2)
    next()
    console.log('6')
}, function (req, res, next) {
    console.log(3)
    next()
    console.log('7')
})

app.get('/', function (req, res, next) {
    console.log(4)
    res.end('okk')
})

app.listen(3000)