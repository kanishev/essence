const keys = require("../keys/index");

module.exports = function (req, res, next) {
  res.locals.user = req.session.user;
  res.locals.admin = null;

  if (res.locals.user) {
    if (res.locals.user.email == keys.ADMIN) {
      res.locals.admin = req.session.user;
    }
  }

  next();
};
