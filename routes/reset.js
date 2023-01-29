const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.get("/", (req, res) => {
  res.render("reset", {
    title: "Forget password",
    error: req.flash("resetError"),
    success: req.flash("success"),
  });
});

router.get("/password/:token", async (req, res) => {
  try {
    if (!req.params.token) {
      req.flash("resetError", "Токен не найдет");
      res.redirect("/reset");
    }

    const user = await User.findOne({
      token: req.params.token,
      tokenExp: { $gt: Date.now() },
    });

    if (user) {
      res.render("createPass", {
        title: "New password",
        token: user.token,
        userId: user._id.toString(),
      });
    } else {
      res.redirect("/reset");
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/password/create", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      token: req.body.token,
      tokenExp: { $gt: Date.now() },
    });

    if (!user) {
      req.flash("resetError", "Время токена истекло");
      res.redirect("/reset");
    } else {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.token = undefined;
      user.tokenExp = undefined;
      await user.save();
      req.flash("reseted", "Пароль успешно изменен!");
      res.redirect("/");
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
