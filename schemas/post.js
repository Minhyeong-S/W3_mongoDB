const { Schema, model } = require('mongoose');
const moment = require('moment');

const PostSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// mongoose에게 전달 : 'post'라는 컬렉션을 만들거고, 저장되는 정보는 UserSchema 데이터 형태를 가지고 있어.
// mongoose가 'posts'라는 컬렉션 복수로 자동 생성
const Post = model('post', PostSchema);

module.exports = { Post };
