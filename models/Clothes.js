const {Schema, model} = require('mongoose')

const goods = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    hoverImg: {
        type: String,
        required: true
    },
    loved: String

})


module.exports = model('goods', goods)