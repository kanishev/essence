const {Router} = require('express')
const router = Router()
const User = require('../models/User')
const auth = require('../middleware/auth')
const Order = require('../models/Order')
const bcrypt = require('bcrypt') 
const crypto = require('crypto')
const {validationResult} = require('express-validator')
const nodemailer = require('nodemailer')
const transporter = require('nodemailer-sendgrid-transport')
const resetPass = require('../mails/reset')
const keys = require('../keys/index')
const sender = require('../mails/reqister')
const subscribe = require('../mails/subscribe')
const sendOrder = require('../mails/orders')
const {registerValidator} = require('../utils/validators')


const mailer = nodemailer.createTransport(transporter({
    auth : {
        api_key: keys.SANDGRID_KEY
    }
}))

// Send register mail

router.post('/register', registerValidator, async (req, res) => {

    try{
        const {password, email, cart} = req.body

        const errors = validationResult(req)
        if (!errors.isEmpty()){
            req.flash('authError', errors.array()[0].msg)
            return res.status(422).redirect('/')
        }
        
        const hashed = await bcrypt.hash(password, 10)
        const user = new User({
            email: email,
            password: hashed,
            cart
        })
        await user.save()
        res.redirect('/')
        await mailer.sendMail(sender(email))
            
    }catch(e){
        console.log(e)
    }
   
})

// Password reset

router.post('/reset', (req, res) => {

    try{
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) throw err
            const token = buffer.toString('hex')
            const user = await User.findOne({email: req.body.email})
            
            if(user){
                user.token = token
                user.tokenExp = Date.now() + 3600000
                await user.save()
                await mailer.sendMail(resetPass(user.email, token))
                req.flash('success', 'Проверьте вашу почту')
                res.redirect('/reset')
            }
            else{
                req.flash('resetError', 'Такого пользователя нет')
                res.redirect('/reset')
            }
        })
    }
    catch(e){
        console.log(e)
    }
   
})

// footer subscriber

router.post('/subscribe', async (req, res) => {

    try{
        const user = await User.findOne({email: req.body.email})
    
        if(user){
            await mailer.sendMail(subscribe(user.email))
            req.flash('notice', 'Ура! Проверьте почту')
            res.redirect('/')
        }else{
            req.flash('notice', 'Такого пользователя нет')
            res.redirect('/')
        }    
    }
    catch(e){
        console.log(e)
    }
   
})

router.post('/buy' , auth, async (req, res) => {

    try{
        const user = await req.user.populate('cart.items.goodId').execPopulate()

        const goods = user.cart.items.map(g => ({
            good: {...g.goodId._doc},
            count: g.count
        }))
    
        const order = await new Order({
            goods: goods,
            user: {
                name: req.user.name,
                userId: req.user
            }
        })
    
        await order.save()
        await req.user.clearCart()
        await mailer.sendMail(sendOrder())
    
        res.redirect('/order')
    }catch(e){
        console.log(e)
    }
    
    

})


module.exports = router