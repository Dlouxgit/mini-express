const express = require('./express')
const path = require('path')

const app = express()

// app.use((req, res, next) => {
//     res.send = function (data) {

//     }
// })

app.param('id', function(req, res, next, value, key) {
    console.log(value);
    console.log('value')
    next();
})

app.get('/user/:id/:name/xxx', function (req, res) {
    res.send({name: 'dl'})
})

app.get('/md', function (req, res, next) {
    res.sendFile(path.resolve(__dirname, 'express.md'))
})

app.listen(3000, function () {
    console.log('server start 3000')
})