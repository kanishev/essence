const {Router} = require('express')
const Order = require('../models/Order')
const auth = require('../middleware/auth')
const router = Router()


router.get('/', auth, async (req, res) => {

    try{
        const orders = await Order.find({'user.userId': req.user._id})
        .populate('user.userId')
    
        const order = orders.map(o => ({
            user: {
                    name: o.user.userId.email,
                    id: o.user.userId._id    
                },
            good: o.goods,
            total: o.goods.reduce((acc, g) => {
                return acc += g.count * +g.good.price         
            }, 0 )
        }))
    
    
        res.render('order', {
            title: 'Orders',
            order
        })
    }catch(e){
        console.log(e)
    }

   

})


module.exports = router