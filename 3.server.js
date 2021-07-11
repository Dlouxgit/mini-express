const express = require('express')

const app = express()

app.get('/user', function (req, res) {
    res.end('user')
})

app.listen(3000, function () {
    console.log('server start: 3000')
})