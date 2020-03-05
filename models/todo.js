// mongodb: 指令的一部分
// localhost: 資料庫的位置
// todo: 資料庫的名稱
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const todoSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  done: {
    type: Boolean,
    default: false
  },
  // 加入 userId，建立跟 User 的關聯
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // 定義這個屬性是從 User 這個 model 取得
    index: true, // 索引，設定成可用來查詢
    required: true
  }
})
module.exports = mongoose.model('Todo', todoSchema)
