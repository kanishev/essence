const {Schema, model} = require('mongoose')

const guest = new Schema({
    id: {
        type: String,
        required: true
    },
    favour: {
        items: [
            {
             goodId: {
                 type: Schema.Types.ObjectId,
                 ref: 'goods',
                 required: true
             }
            }
           
        ]
    }
})


guest.methods.addFavour = function(good){
    let cloned = [...this.favour.items]
    const idx = cloned.findIndex( c => c.goodId.toString() == good.id.toString())
    if (idx == -1){
        cloned.push({
            goodId: good.id
        })
    }

    this.favour = {items: cloned}
    return this.save()
}

guest.methods.removeFavour = function(good){
    let cloned = [...this.favour.items]
    const idx = cloned.findIndex( c => c.goodId.toString() == good.id.toString())
    if (idx >= 0){
        cloned = cloned.filter(c => c.goodId.toString() !== good._id.toString())
    }
    this.favour = {items: cloned}
    return this.save()
}

module.exports = model('Guest', guest)