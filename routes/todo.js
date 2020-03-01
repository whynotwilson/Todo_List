const express = require('express')
const router = express.Router()
const Todo = require('../models/todo')

// 設定路由
// 列出全部 Todo
router.get('/', (req, res) => {
  Todo.find()
    .sort({ name: 'asc' })
    .lean()
    .exec((err, todos) => {
      if (err) return console.error(err)
      return res.render('index', { todos })
    })
})
// 新增一筆 Todo 頁面
router.get('/new', (req, res) => {
  return res.render('new')
})
// 顯示一筆 Todo 的詳細內容
router.get('/:id', (req, res) => {
  Todo.findById(req.params.id)
    .lean()
    .exec((err, todo) => {
      if (err) return console.error(err)
      return res.render('detail', { todo })
    })
})
// 新增一筆  Todo
router.post('/', (req, res) => {
  const todo = new Todo({
    name: req.body.name
  })
  todo.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})
// 修改 Todo 頁面
router.get('/:id/edit', (req, res) => {
  Todo.findById(req.params.id)
    .lean()
    .exec((err, todo) => {
      if (err) return console.error(err)
      return res.render('edit', { todo })
    })
})
// 修改 Todo
router.put('/:id', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    todo.name = req.body.name
    if (req.body.done === 'on') {
      todo.done = true
    } else {
      todo.done = false
    }
    todo.save(err => {
      if (err) return console.error(err)
      return res.redirect(`/todos/${req.params.id}`)
    })
  })
})
// 刪除 Todo
router.delete('/:id/delete', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    todo.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

module.exports = router
