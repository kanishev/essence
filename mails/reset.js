const keys = require('../keys/index')

module.exports = function(to, token) {
    return {
        to: to,
        from: keys.EMAIL_FROM,
        subject: 'Восстановление доступа',
        html: `
            <h1>Вы забыли пароль?</h1>
            <p>Если нет, то проигнорируйте данное письмо </p>
            <p>Инача, нажмите на ссылку: </p>
            <p><a href="${keys.BASE_URL}/reset/password/${token}">Восстановить доступ</a></p>
            <hr/>
            <a href="${keys.BASE_URL}">Магазин здесь</a>
        `
    }
}