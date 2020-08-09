const {Router} = require('express')
const Clothes = require('../models/Clothes')
const router = Router()

function toGood(favour){
    return favour.items.map(c => ({
        ...c.goodId._doc
    }))
}


router.get('/add/:id', async (req, res) => {

    try{
        if(req.guest){
            const clothes = await Clothes.findById({_id: req.params.id})
            req.guest.addFavour(clothes)
            res.status(200).json('active')
        } else if (req.user){
            const clothes = await Clothes.findById({_id: req.params.id})
            req.user.addFavour(clothes)
            res.status(200).json('active')
        }
    }catch(e){
        console.log(e)
    }
   
})

router.get('/remove/:id', async (req, res) => {
    
    try {
        if(req.guest){
            let clothes = await Clothes.findById({_id: req.params.id})
            req.guest.removeFavour(clothes)
    
            clothes = await req.guest.populate('favour.items.goodId').execPopulate()
            const good = toGood(clothes.favour)
            res.status(200).json(good)
            
        } else if (req.user){
            let clothes = await Clothes.findById({_id: req.params.id})
            req.user.removeFavour(clothes)
    
            clothes = await req.user.populate('favour.items.goodId').execPopulate()
            const good = toGood(clothes.favour)
            res.status(200).json(good)
        }
    }catch(e){
        console.log(e)
    }
   
})


router.get('/', async (req, res) => {

    try{
        if(req.guest){
            const guest = await req.guest.populate('favour.items.goodId').execPopulate()
            const goods = toGood(guest.favour)
    
            res.render('favourite', {
                title: 'Favourite',
                goods
            })
    
        } else if (req.user){
            const user = await req.user.populate('favour.items.goodId').execPopulate()
            const goods = toGood(user.favour)
    
            res.render('favourite', {
                title: 'Favourite',
                goods
            })
        }
    }catch(e){
        console.log(e)
    }
  
   
})

module.exports = router
