const { Router } = require("express");
const auth = require("../middleware/auth");
const Clothes = require("../models/Clothes");
const e = require("express");
const router = Router();

function toMoney(price) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

function toGood(cart) {
  return cart.items.map((c) => ({
    ...c.goodId._doc,
    count: c.count,
  }));
}

function toTotal(cart) {
  return cart.reduce((acc, c) => {
    acc += +c.count * +c.price;
    return acc;
  }, 0);
}

function toEqual(liked, clothes) {
  liked.forEach((l) => {
    if (l.goodId._id == null) {
      return true;
    }
    clothes.forEach((c) => {
      if (l.goodId._id.toString() == c._id.toString()) {
        c.loved = "active";
      }
    });
  });
}

router.get("/", async (req, res) => {
  try {
    const clothes = await (await Clothes.find()).reverse();
    let favourites;

    if (req.user) {
      favourites = await req.user
        .populate("favour.items.goodId")
        .execPopulate();

      favourites.favour.items.forEach((f) => {
        if (f.goodId == null) {
          return true;
        } else {
          toEqual(favourites.favour.items, clothes);
        }
      });
    }

    res.render("index", {
      title: "Главная страница",
      authError: req.flash("authError"),
      reseted: req.flash("reseted"),
      notice: req.flash("notice"),
      clothes,
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/blog", (req, res) => {
  res.render("blog", {
    title: "Главная страница",
  });
});

router.get("/checkout", auth, async (req, res) => {
  try {
    const user = await req.user.populate("cart.items.goodId").execPopulate();
    const goods = toGood(user.cart);

    const price = toMoney(toTotal(goods));

    res.render("checkout", {
      title: "Главная страница",
      cart: goods,
      price,
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/regular", (req, res) => {
  res.render("regular-page", {
    title: "Главная страница",
  });
});

router.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Главная страница",
  });
});

router.get("/shop", async (req, res) => {
  try {
    let goods = await Clothes.find();
    let favourites;

    if (req.user) {
      favourites = await req.user
        .populate("favour.items.goodId")
        .execPopulate();

      favourites.favour.items.forEach((f) => {
        if (f.goodId == null) {
          return true;
        } else {
          toEqual(favourites.favour.items, goods);
        }
      });
    }

    goods.forEach((good) => (good.price = toMoney(good.price)));

    res.render("shop", {
      title: "Главная страница",
      goods,
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/single-blog", (req, res) => {
  res.render("single-blog", {
    title: "Главная страница",
  });
});

router.get("/single-product-details", (req, res) => {
  res.render("single-product-details", {
    title: "Главная страница",
  });
});

module.exports = router;
