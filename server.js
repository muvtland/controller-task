const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const productRoutes = require('./routes/product.routes')
const articleRoutes = require('./routes/article.routes')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/api/products', productRoutes)
app.use('/api/articles', articleRoutes)

const PORT = process.env.PORT || 5000

mongoose.connect('mongodb://localhost:27017/test-project', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('connect to db...')
    app.listen(PORT, () => console.log('server has been started on port:5000'))
}).catch(e => {

})

