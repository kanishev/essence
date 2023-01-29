const { Router } = require("express");
const Clothes = require("../models/Clothes");
const router = Router();

function toGood(favour) {
  return favour.items.map((c) => ({
    ...c.goodId._doc,
  }));
}

router.get("/add/:id", async (req, res) => {
  try {
    const clothes = await Clothes.findById({ _id: req.params.id });
    req.user.addFavour(clothes);
    res.status(200).json("active");
  } catch (e) {
    console.log(e);
  }
});

router.get("/remove/:id", async (req, res) => {
  try {
    let clothes = await Clothes.findById({ _id: req.params.id });
    req.user.removeFavour(clothes);

    clothes = await req.user.populate("favour.items.goodId").execPopulate();
    const good = toGood(clothes.favour);
    res.status(200).json(good);
  } catch (e) {
    console.log(e);
  }
});

router.get("/", async (req, res) => {
  try {
    const user = await req.user.populate("favour.items.goodId").execPopulate();
    const goods = toGood(user.favour);

    res.render("favourite", {
      title: "Favourite",
      goods,
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
