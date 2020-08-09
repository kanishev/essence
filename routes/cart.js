const {Router} = require('express')
const Clothes = require('../models/Clothes')
const cartAuth = require('../middleware/auth')
const auth = require('../middleware/auth')
const router = Router()

function toMoney(price){
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
}

function toGood(cart){
    return cart.items.map(c => ({
        ...c.goodId._doc, count: c.count
    }))
}

function toTotal(cart){
    return cart.reduce((acc, c) => {
        acc += +c.count * +c.price
        return acc
    }, 0)
}


router.post('/add', cartAuth,  async (req, res) => {
    const good = await Clothes.findById(req.body.id)
    await req.user.addGood(good)
    res.redirect('/checkout')
})

router.put('/add/:id', auth, async (req, res) => {

    try{
        const good = {id: req.params.id}
        await req.user.addGood(good)
    
        const user = await req.user.populate('cart.items.goodId').execPopulate()
        const goods = toGood(user.cart)
        const price = toMoney(toTotal(goods))
      
        const data = {
            goods, price
        }
     
        res.status(200).json(data)
    }
    catch(e){
        console.log(e)
    }
    
   
})


router.delete('/remove/:id', auth, async (req, res) => {

    try{
        const good = {id: req.params.id}
        await req.user.removeGood(good)
    
        const user = await req.user.populate('cart.items.goodId').execPopulate()
        const goods = toGood(user.cart)
        const price = toMoney(toTotal(goods))
      
        const data = {
            goods, price
        }
    
        res.status(200).json(data)
    }catch(e){
        console.log(e)
    }
   
})


module.exports = router