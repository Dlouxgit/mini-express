const express = require('./express')

const app = express()

app.get('/', function (req, res) {
    res.end('home')
})

app.get('/hello', function (req, res) {
    res.end('hello')
})

// app.all('*', function (req, res) {
//     res.end('all')
// })

app.listen(3000, function () {
    console.log('server start at 3000')
})