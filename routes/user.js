const express = require('../express')

const router = express.Router() // 这就是 express 不能用 es6 class 重写的原因，因为还能执行这个构造函数

router.get('/add', function (req, res) {
    res.end('user add')
})

router.get('/remove', function (req, res) {
    res.end('user remove')
})


module.exports = router