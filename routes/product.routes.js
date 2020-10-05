const express = require('express')
const router = express.Router()
const {Product} = require('../models/product.model')
const {Article} = require('../models/article.model')

router.post('/', async (req, res) => {
    try {
        const {name, description, price} = req.body

        if (!name && !description && !price) {
            return res.status(400).json({message: 'partial information'})
        }
        const product = new Product({name, description, price})
        await product.save()
        res.status(201).json({message: 'product added'})
    } catch (e) {
        res.status(400).json({message: e.message})
    }
})

router.get('/', async (req, res) => {
    try {
        const id = req.query.id
        const name = req.query.name
        const price = req.query.price
        const direction = req.query.direction

        if (id){
            const product = await Product.findById(id).lean()
            if (product){
                product.articles = await Article.find({productId: id}).lean()
                return res.status(200).json({product})
            }else {
                return res.status(400).json({message: 'product with this id not found'})
            }
        }
        if (name){
            const product = await Product.findOne({name})
            if (product){
                product.articles = await Article.find({productId: product._id}).lean()
                return res.status(200).json(product)
            }else {
                return res.status(400).json({message: 'product with this name not found'})
            }
        }
        if (price && direction){
            const products = await Product.find({price: direction > 0 ? {$gte: price} : {$lte: price}}).lean()
            for (let i = 0; i < products.length; i++){
                const id = products[i]._id
                products[i].articles = await Article.find({productId: id}).lean()
            }
            if (products){
                return res.status(200).json(products)
            }else {
                return res.status(400).json({message: 'products not found'})
            }
        }

        const products = await Product.find().lean()

        if (products) {
            for (let i = 0;i < products.length;i++){
                const id = products[i]._id
                products[i].articles = await Article.find({productId: id}).lean()
            }
            return res.status(200).json(products)
        }
        res.status(400).json({message: 'Something wrong.Try again'})
    } catch (e) {
        res.status(400).json({message: e.message})
    }
})


router.put('/', async (req, res) => {
    try {
        const update = {...req.body}
        const id = req.body.id
        delete update.id

        if (id){
            await Product.findByIdAndUpdate(id, update)
            res.status(200).json({message: 'product updated'})
        }else {
            res.status(400).json({message: 'id not fund'})
        }
    } catch (e) {
        res.status(400).json({message: e.message})
    }
})

router.delete('/', async (req, res) => {
    try {
        const id = req.body.id
        const product = Product.findById(id)
        await product.remove()
        const articles = await Article.find({productId: id})
        for (let i = 0; i < articles.length; i++){
            await articles[i].remove()
        }
        res.status(200).json({message: 'product deleted'})
    } catch (e) {
        res.status(400).json({message: e.message})
    }
})


module.exports = router