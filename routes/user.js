const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

// 登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

// 登入檢查
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { // 使用 passport 認證
    successRedirect: '/', // 登入成功回到根目錄
    failureRedirect: '/users/login' // 登入失敗返回登入頁
  })(req, res, next)
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

      // 用 bcrypt 處理密碼後再儲存
      // 第一個參數是複雜度係數，預設為 10
      // 再用 hash 把鹽跟使用者密碼配在一起，然後產生雜湊處理後的 hash
      bcrypt.genSalt(10, (err, salt) => {
        if (err) console.log(err)
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          // throw，遇到 throw 後，當下執行的函式會停止，並交給後面的 catch 接手
          if (err) throw err
          newUser.password = hash
          newUser
            .save()
            .then(user => {
              res.redirect('/')
            })
            .catch(err => console.log(err))
        })
      })
    }
  })
})

// 登出
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

module.exports = router
