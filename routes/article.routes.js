const express = require('express')
const router = express.Router()
const {Article} =require('../models/article.model')
const {Product} =require('../models/product.model')

router.post('/', async (req, res) => {
    try {
        const {name, content, productId} = req.body

        if (name && content && productId) {
            const product = await Product.findById(productId).lean()
            if (product){
                const article = new Article({name, content, productId})
                await article.save()
                return res.status(201).json({message: 'article added'})
            }else {
                return res.status(400).json({message: 'this productId not found'})
            }
        }else {
            res.status(400).json({message: 'partial information'})
        }
    }catch (e) {
        res.status(400).json({message: e.message})
    }
})


router.get('/', async (req, res) => {
    try {
        const id = req.query.id
        const productId = req.query.productId
        const name = req.query.name

        if (id){
            const article = await Article.findById(id).populate('productId')
            if (article){
                return res.status(200).json(article)
            }else {
                return res.status(400).json({message: 'article with this id not found'})
            }
        }
        if (productId){
            const article = await Article.findOne({productId}).populate('productId')
            if (article){
                return res.status(200).json(article)
            }else {
                return res.status(400).json({message: 'article with this product id not found'})
            }
        }
        if (name){
            const article = await Article.findOne({name}).populate('productId')
            if (article){
                return res.status(200).json(article)
            }else {
                return res.status(400).json({message: 'article with this name not found'})
            }
        }

        const articles = await Article.find().populate('productId')
        if (!articles) {
            return res.status(400).json({message: 'Something wrong.Try again'})
        }
        return res.status(200).json(articles)

    }catch (e) {
        res.status(400).json({message: e.message})
    }
})



router.put('/', async (req, res) => {
    try {
        const update = {...req.body}
        delete update.id
        const id = req.body.id
        if (id){
            if (update.productId){
                const product = await Product.findById(update.productId).lean()
                if (product){
                    await Article.findByIdAndUpdate(id, update)
                    return res.status(200).json({message: 'product updated'})
                }else {
                    return res.status(400).json({message: 'article with this product id not found'})
                }
            }
            await Article.findByIdAndUpdate(id, update)
            return res.status(200).json({message: 'product updated'})
        }else {
            res.status(400).json({message: 'id not fund'})
        }
    }catch (e) {
        res.status(400).json({message: e.message})
    }
})

router.delete('/', async (req, res) => {
    try {
        const id = req.body.id
        if (id){
            const article = await Article.findById(id)
            await article.delete()
            res.status(200).json({message: 'article deleted'})
        }else {
            res.status(400).json({message: 'id not fund'})
        }
    }catch (e) {
        res.status(400).json({message: e.message})
    }
})


module.exports = router
