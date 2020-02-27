const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 資料庫連線
mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true, useUnifiedTopology: true })

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

// 載入 todo model
const Todo = require('./models/todo')

// 設定路由
// Todo 首頁
app.get('/', (req, res) => {
  return res.redirect('/todos')
})
// 列出全部 Todo
app.get('/todos', (req, res) => {
  Todo.find()
    .lean()
    .exec((err, todos) => {
      if (err) return console.error(err)
      return res.render('index', { todos })
    })
})
// 新增一筆 Todo 頁面
app.get('/todos/new', (req, res) => {
  return res.render('new')
})
// 顯示一筆 Todo 的詳細內容
app.get('/todos/:id', (req, res) => {
  Todo.findById(req.params.id)
    .lean()
    .exec((err, todo) => {
      if (err) return console.error(err)
      return res.render('detail', { todo })
    })
})
// 新增一筆  Todo
app.post('/todos', (req, res) => {
  const todo = new Todo({
    name: req.body.name
  })
  todo.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})
// 修改 Todo 頁面
app.get('/todos/:id/edit', (req, res) => {
  res.send('修改 Todo 頁面')
})
// 修改 Todo
app.post('/todos/:id/edit', (req, res) => {
  res.send('修改 Todo')
})
// 刪除 Todo
app.post('/todos/:id/delete', (req, res) => {
  res.send('刪除 Todo')
})

app.listen(port, () => {
  console.log('To-do List is running on port', port)
})
