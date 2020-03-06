const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const FacebookStrategy = require('passport-facebook').Strategy

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

  passport.use(
    new FacebookStrategy({
      clientID: process.env.FACEBOOK_ID, // 應用程式編號
      clientSecret: process.env.FACEBOOK_SECRET, // 應用程式密鑰
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ['email', 'displayName']
    }, (accessToken, refreshToken, profile, done) => {
      // 尋找和新增 user
      User.findOne({
        email: profile._json.email
      }).then(user => {
        // 如果 email 不存在就建立新的使用者
        if (!user) {
          // 因為密碼是必填欄位，而且使用 facebook 登入不用另外設定密碼，
          // 所以我們幫使用者隨機產生一組密碼，然後用 bcryptjs 處理後再儲存起來
          // toString(36) 的36代表36進位(0-9 a-z 共36碼)
          // slice(-8) 從後面往前取8碼
          var randomPassword = Math.random().toString(36).slice(-8)
          bcrypt.genSalt(10, (err, salt) => {
            if (err) console.error(err)
            bcrypt.hash(randomPassword, salt, (err, hash) => {
              if (err) console.error(err)
              var newUser = User({
                name: profile._json.name,
                email: profile._json.email,
                password: hash
              })
              newUser.save().then(user => {
                return done(null, user)
              }).catch(err => {
                console.log(err)
              })
            })
          })
        // 如果資料庫已經有該 email，表示已註冊過，直接回傳該使用者就好
        } else {
          return done(null, user)
        }
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
