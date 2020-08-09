const keys = require('../keys/index')

module.exports = function(to){
    return {
        to: 'kanishevnikita@yandex.kz',
        from: 'nikitakanishevv@gmail.com',
        subject: 'New Order!',
        text: 'New Order!',
        html: `
            <h1>New order, check the admin page to see more</h1>
            <hr/>
            <p>You can come back from this link:</p>
            <span>${keys.BASE_URL}</span>
        
        `
    }
}