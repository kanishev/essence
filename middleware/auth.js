module.exports = function auth(req, res, next) {

    if(!req.session.isAuthenticated){
        return res.redirect('/')
    }
    next()
}

module.exports = function cartAuth(req, res, next) {

    if(!req.session.isAuthenticated){
        return res.redirect('/')
    }
    next()
}