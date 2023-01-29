const { Schema, model } = require("mongoose");
const user = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: String,
  tokenExp: String,
  favour: {
    items: [
      {
        goodId: {
          type: Schema.Types.ObjectId,
          ref: "goods",
          required: true,
        },
      },
    ],
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        goodId: {
          type: Schema.Types.ObjectId,
          ref: "goods",
          required: true,
        },
      },
    ],
  },
});

user.methods.addGood = function (good) {
  let cloned = [...this.cart.items];
  const idx = cloned.findIndex(
    (c) => c.goodId.toString() == good.id.toString()
  );

  if (idx >= 0) {
    cloned[idx].count = cloned[idx].count + 1;
  } else {
    cloned.push({
      goodId: good.id,
      count: 1,
    });
  }

  this.cart = { items: cloned };
  return this.save();
};

user.methods.removeGood = function (good) {
  let cloned = [...this.cart.items];
  const idx = cloned.findIndex(
    (c) => c.goodId.toString() == good.id.toString()
  );
  const candidate = cloned[idx];

  if (candidate.count == 1) {
    cloned = cloned.filter((c) => c.goodId.toString() !== good.id.toString());
  } else {
    candidate.count = candidate.count - 1;
  }

  this.cart = { items: cloned };
  return this.save();
};

user.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

user.methods.addFavour = function (good) {
  let cloned = [...this.favour.items];
  const idx = cloned.findIndex(
    (c) => c.goodId.toString() == good.id.toString()
  );
  if (idx == -1) {
    cloned.push({
      goodId: good.id,
    });
  }

  this.favour = { items: cloned };
  return this.save();
};

user.methods.removeFavour = function (good) {
  let cloned = [...this.favour.items];
  const idx = cloned.findIndex(
    (c) => c.goodId.toString() == good.id.toString()
  );
  if (idx >= 0) {
    cloned = cloned.filter((c) => c.goodId.toString() !== good._id.toString());
  }
  this.favour = { items: cloned };
  return this.save();
};

module.exports = model("User", user);
