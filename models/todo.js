// mongodb: 指令的一部分
// localhost: 資料庫的位置
// todo: 資料庫的名稱
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const todoSchema = new Schema({
  name: {
    type: String,
    required: true
  }
})
module.exports = mongoose.model('Todo', todoSchema)
