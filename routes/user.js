const express = require('express')
const router = express.Router()
const User = require('../models/user')

// 登入頁面
router.get('/', (req, res) => {
  res.render('login')
})

// 登入檢查
router.post('/', (req, res) => {
  res.send('login')
})

// 註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

// 註冊檢查
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  User.findOne({ email: email }).then(user => {
    // 檢查要註冊的 email 是否已存在
    if (user) {
      // 已存在返回註冊頁面
      console.log('User already exists')
      res.render('register', {
        name,
        email,
        password,
        password2
      })
    } else {
      // 不存在則新增使用者，新增完成後導回首頁
      const newUser = new User({
        name,
        email,
        password
      })
      newUser
        .save()
        .then(user => {
          res.redirect('/')
        })
        .catch(err => console.log(err))
    }
  })
})

// 登出
router.get('/logout', (req, res) => {
  res.send('logout')
})

module.exports = router
