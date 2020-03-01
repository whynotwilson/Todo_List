const express = require('express')
const router = express.Router()
const Todo = require('../models/todo')

// Todo 首頁
router.get('/', (req, res) => {
  Todo.find()
    .sort({ name: 'asc' })
    .lean()
    .exec((err, todos) => {
      if (err) console.error(err)
      return res.render('index', { todos })
    })
})

module.exports = router
