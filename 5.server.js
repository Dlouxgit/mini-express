const express = require('./express')
const app = express()
const user = require('./routes/user')
const article = require('./routes/article')

app.use('/user', user)
app.use('/article', article)

app.listen(3000, function () {
    console.log('server start 3000')
})