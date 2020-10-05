const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    content: {
        type:String, required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
})

const Article = model('Article', schema)
exports.Article = Article