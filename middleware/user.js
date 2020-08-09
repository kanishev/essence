const User = require('../models/User')
const Guest = require('../models/Guest')
const uuid = require('uuid').v4

module.exports = async function(req, res, next) {

    if(! req.session.user){
        const id = uuid()
        const guest = await Guest.findOne({id: id})

        if(guest){
            req.guest = guest
        }
        else {
            const guest = await new Guest({id: id})
            guest.save()
            req.guest = guest
        }
    
        return next()
    }

    req.quest = null
    req.user = await User.findById(req.session.user._id)

    next()
}