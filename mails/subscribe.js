const keys = require('../keys/index')

module.exports = function(to){
    return {
        to: to,
        from: 'nikitakanishevv@gmail.com',
        subject: 'Subscribed!',
        text: 'Essence',
        html: `
            <h1>Welcome to our shop!, dear ${to}</h1>
            <hr/>
            <p>You can come back from this link:</p>
            <span>${keys.BASE_URL}</span>
        
        `
    }
}