const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const compression = require('compression')
const flash = require('connect-flash')
const csurf = require('csurf')
const Handlebars = require('handlebars')
const expresshbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const mainRoute = require('./routes/pages')
const orderRoute = require('./routes/order')
const authRoute = require('./routes/login')
const adminPage = require('./routes/adminpage')
const cartRoute = require('./routes/cart')
const emailRoute = require('./routes/email')
const resetRouter = require('./routes/reset')
const favouriteRouter = require('./routes/favourite')
const varMdw = require('./middleware/variables')
const adminMdw = require('./middleware/admin')
const notFound = require('./middleware/404')
const userMdw = require('./middleware/user')
const fileMdw = require('./middleware/file')
const keys = require('./keys/index')

const app = express()

const hbs = expresshbs.create({
    'defaultLayout': 'main',
    'extname' : 'hbs',
    'handlebars' : allowInsecurePrototypeAccess(Handlebars),
    helpers: require('./utils/hbs-helpers')
})

const store = new MongoDBStore({
  collection: 'session',
  uri: keys.URL
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use('/public/img/my-img', express.static(path.join(__dirname, 'public/img/my-img')))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(
    session({
      secret: keys.SECRET,
      saveUninitialized: false,
      resave: false,
      store
    })
  )

app.use(fileMdw.single('newGood'))
app.use(csurf())
app.use(flash())
app.use(compression())
app.use(varMdw)
app.use(adminMdw)
app.use(userMdw)

app.use(bodyParser.json())

app.use('/', mainRoute)
app.use('/order', orderRoute)
app.use('/login', authRoute)
app.use('/', adminPage)
app.use('/cart', cartRoute)
app.use('/reset', resetRouter)
app.use('/email', emailRoute)
app.use('/favourite', favouriteRouter)

app.use(notFound)
const PORT = process.env.PORT || 3000

async function start(){

  try{
    await mongoose.connect(keys.URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  
    app.listen(PORT, function () {
      console.log('Server has been started...');
    });
  }catch(e){
    console.log(e)
  }
  
}


start()

