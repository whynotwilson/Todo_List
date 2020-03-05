const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = passport => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' })
        }
        // 用 bcryptjs 比較使用者輸入的密碼及資料庫的密碼是否為同一組字串
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err
          if (isMatch) {
            return done(null, user)
          } else {
            return done(null, false, { message: 'Email or Password incorrect' })
          }
        })
      })
    })
  )
  // 序列化，只存放 id 就好，目的是節省空間
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // 反序列化，使用 id 獲取完整 user 資訊
  // 因取得的 user 資訊有可能會傳給前端使用，所以得加上 .lean().exec()
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .exec((err, user) => {
        done(err, user)
      })
  })
}
