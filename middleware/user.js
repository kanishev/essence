const User = require('../models/User')
const Guest = require('../models/Guest')

module.exports = async function(req, res, next) {

    if(! req.session.user){
        const id = process.env.COMPUTERNAME
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