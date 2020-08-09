module.exports = function(req, res, next) {
      if(!res.locals.admin){
        return res.redirect('/')
      }
      next()
}