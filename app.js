const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const port = 3000

// 判別開發環境
if (process.env.NODE_ENV !== 'production') { // 如果不是 production 模式
  require('dotenv').config() // 使用 dotenv 讀取 .env 檔案
}

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(flash()) // 使用者提示

// 設定 session
app.use(session({
  secret: 'ALPHA camp Todo-List Session & Cookie function',
  resave: false,
  saveUninitialized: true
}))

// passport.session() 要寫在 session() 之後
app.use(passport.initialize())
app.use(passport.session())

// 建立 local variables，可使用 res.locals 將訊息交給 View 顯示
// res.locals.success_msg: 展示 「成功」 訊息
// res.locals.warning_mag: 展示 「警告」 訊息
// 要寫在 session 之後，訊息提示需要 session 的登入狀態
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()// 辨識使用者是否已經登入的變數，讓 View 可以使用

  // 新增二個 flash message 變數
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

// 資料庫連線
mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

// 資料庫連線後，透過 mongoose.connection 拿到 Connection 的物件
const db = mongoose.connection

// 連線異常
db.on('error', () => {
  console.log('mongoDB error')
})

// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

require('./config/passport')(passport)

// 登入後可以取得使用者的資訊方便我們在 view 裡面直接使用
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated() // 辨識使用者是否已經登入的變數，讓 view 可以使用
  next()
})

// 設定路由器
app.use('/', require('./routes/home'))
app.use('/todos', require('./routes/todo'))
app.use('/users', require('./routes/user'))
app.use('/auth', require('./routes/auths'))

app.listen(port, () => {
  console.log('Todo_List Server is running on port', port)
})
