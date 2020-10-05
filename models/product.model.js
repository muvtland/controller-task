const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type:Number,
        required: true,
        index: true
    }
})

const Product = model('Product', schema)
exports.Product = Product