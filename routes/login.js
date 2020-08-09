const {Router} = require('express')
const {validationResult} = require('express-validator')
const {loginValidator} = require('../utils/validators')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const router = Router()

router.get('/logout', (req, res) => {
    req.session.destroy( () =>{
        res.redirect('/')
    })
})

router.post('/login', async (req, res) => {

        try{
           
            const user = await User.findOne({email: req.body.email})
            if(user){
                const areSame = await bcrypt.compare(req.body.password, user.password)
                if(areSame){
                    req.session.user = user
                    req.session.isAuthenticated = true
                    req.session.save( err => {
                        if(err) throw err
                    })
                    res.redirect('/')
                }
                else{
                   req.flash('authError', 'Неверный пароль')
                   res.redirect('/')
                }
            }else{
                req.flash('authError', 'Такого пользователя нет')
                res.redirect('/')
            }

        
        }catch(e){
            console.log(e)
        }
        
})


module.exports = router