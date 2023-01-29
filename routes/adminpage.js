const { Router } = require("express");
const Clothes = require("../models/Clothes");
const adminpage = require("../middleware/adminpage");

const router = Router();

router.get("/admin", adminpage, (req, res) => {
  res.render("admin", {
    title: "Admin Page",
  });
});

router.post("/admin/shop", adminpage, async (req, res) => {
  const { name, price, link, hoverlink } = req.body;

  const good = new Clothes({
    title: name,
    price,
    img: link,
    hoverImg: hoverlink,
    userId: req.user,
    loved: "",
  });

  try {
    good.save();
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

router.post("/admin/addGood", adminpage, (req, res) => {
  if (req.file) {
    res.redirect("/shop");
  }
});

module.exports = router;
