const express = require('./express')

const app = express()
// 中间件，决定是否向下执行，可以拓展方法和属性
app.use('/user', function (req, res, next) {
    console.log('user middleware')
    next('err')
}, function (req, res, next) {
    console.log('user middleware 2 ')
    next()
})

app.get('/user', function (req, res) {
    res.end('user')
})

app.get('/user/admin', function (req, res) {
    res.end('user admin')
})

app.get('/admin', function (req, res) {
    res.end('admin')
})

app.use((err, req, res, handle) => {
    console.log(err)
    res.end(err)
})

app.listen(3000, function () {
    console.log('server start: 3000')
})