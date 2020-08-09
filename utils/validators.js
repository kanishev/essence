const {body} = require('express-validator')
const User = require('../models/User')
const bcrypt = require('bcrypt')

// exports.loginValidator = [

//     body('email')
//     .isEmail()
//     .withMessage('Введите корректный Email')
//     .custom(async (value, {req}) => {

//         try{
           
//             const user = await User.findOne({email: value})
//             if(user){
//                 const areSame = await bcrypt.compare(req.body.password, user.password)
//                 if(areSame){
//                     req.session.user = user
//                     req.session.isAuthenticated = true
//                     return true
//                 }
//                 else{
//                     return Promise.reject('Неверный пароль')
//                 }
//             }else{
//                 return Promise.reject('Такого пользователя не существует')
//             }
//         }
//         catch(e){
//             console.log(e)
//         }
     
      
//     })

// ]

// exports.registerValidator = [

//     body('email')
//     .isEmail()
//     .withMessage('Введите корректный email')
//     .custom(async (value, {req}) => {
//         try{
//             const user = await User.findOne({email: value})
//             console.log(user)
//             if (user){
//                 return Promise.reject('Пользователь уже сущесвтует')
//             }
//         }
//         catch(e){
//             console.log(e)
//         }
       
//     })
//     .normalizeEmail(),

//     body('confirm')
//     .custom((value, {req})=> {
//         if(value !== req.body.password){
//            throw new Error('Пароли должны совпадать')
//         }
//         return true
//     })
//     .trim(),
//     body('password', 'Пароль должен быть минимум 6 символов')
//     .isLength({min: 6, max: 56})
//     .isAlphanumeric()
//     .trim()
// ]