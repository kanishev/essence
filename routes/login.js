const {Router} = require('express')
const {validationResult} = require('express-validator')
const {loginValidator} = require('../utils/validators')
const router = Router()

router.get('/logout', (req, res) => {
    req.session.destroy( () =>{
        res.redirect('/')
    })
})

router.post('/login', loginValidator, async (req, res) => {

        try{
            const errors = validationResult(req)        
            if (!errors.isEmpty()){
                req.flash('authError', errors.array()[0].msg)
                return res.status(422).redirect('/')
            }
     
            req.session.save( err => {
                if(err) throw err
            })

            res.redirect('/')

        }catch(e){
            console.log(e)
        }
        
})


module.exports = router