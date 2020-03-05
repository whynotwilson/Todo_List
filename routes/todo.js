const express = require('express')
const router = express.Router()
const Todo = require('../models/todo')
const { authenticated } = require('../config/auth')

// 設定路由
// 列出全部 Todo
router.get('/', authenticated, (req, res) => {
  Todo.find({ userId: req.user._id })
    .sort({ name: 'asc' })
    .lean()
    .exec((err, todos) => {
      if (err) return console.error(err)
      return res.render('index', { todos })
    })
})
// 新增一筆 Todo 頁面
router.get('/new', authenticated, (req, res) => {
  return res.render('new')
})
// 顯示一筆 Todo 的詳細內容
router.get('/:id', authenticated, (req, res) => {
  Todo.findOne({ _id: req.params.id, userId: req.user._id })
    .lean()
    .exec((err, todo) => {
      if (err) return console.error(err)
      return res.render('detail', { todo })
    })
})
// 新增一筆  Todo
router.post('/', authenticated, (req, res) => {
  const todo = new Todo({
    name: req.body.name,
    userId: req.user._id
  })
  todo.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})
// 修改 Todo 頁面
router.get('/:id/edit', authenticated, (req, res) => {
  Todo.findOne({ _id: req.params.id, userId: req.user._id })
    .lean()
    .exec((err, todo) => {
      if (err) return console.error(err)
      return res.render('edit', { todo })
    })
})
// 修改 Todo
router.put('/:id', authenticated, (req, res) => {
  Todo.findOne({ _id: req.params.id, userId: req.user._id }, (err, todo) => {
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
router.delete('/:id/delete', authenticated, (req, res) => {
  Todo.findOne({ _id: req.params.id, userId: req.user._id }, (err, todo) => {
    if (err) return console.error(err)
    todo.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

module.exports = router
