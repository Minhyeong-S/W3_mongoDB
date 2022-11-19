// express 모듈의 Router 를 Router란 이름으로 가져오기 (구조 분해)
const { Router } = require("express");
// postRouter라는 변수에 가져온 Router() 함수 할당
const postRouter = Router();
const { Post } = require("../schemas/post");
const mongoose = require("mongoose");
const moment = require("moment");

// 전체 게시글 목록
postRouter.get("/", async (req, res) => {
  try {
    const posts = await Post
      .find({}, { __v: false, password: false, content: false })
      .sort({ createdAt: -1 });
      // .sort("-createAt")
    return res.send({ posts });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 특정 게시글 상세조회
postRouter.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId))
      return res.status(400).send({ err: "invalid postId" });
    const post = await Post.findOne({ _id: postId }, { __v: false, password: false });
    return res.send({ post });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 게시글 작성 및 저장. 작성 시 비밀번호 입력.
postRouter.post("/", async (req, res) => {
  try {
    let { name, password, title, content } = req.body;
    if (!name) return res.status(400).send({ err: "name is required" });
    if (!password) return res.status(400).send({ err: "password is required" });
    if (!title) return res.status(400).send({ err: "title is required" });
    if (!content) return res.status(400).send({ err: "content is required" });

    // // Post(객체로 데이터 입력 => req.body와 형태가 같다고 보고 그대로 입력)
    const post = new Post(req.body);
    // mongoose를 통해 user 정보 mongoDB에 저장
    await post.save();

    return res.send({ msg: "포스트가 생성되었습니다." });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 게시물 삭제. 비밀번호가 일치해야 삭제 가능.
postRouter.delete("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { password } = req.body;
    if (!mongoose.isValidObjectId(postId))
      return res.status(400).send({ err: "invalid postId" });
    const post = await Post.findOne({ _id: postId });
    if (password !== post.password)
      return res.status(400).send({ err: "invalid password" });
    await Post.deleteOne({ _id: postId });

    return res.send({ msg: "게시글이 삭제되었습니다." });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 게시물 수정. 제목/내용 수정 가능. 비밀번호 일치해야 삭제 가능.
postRouter.put("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { password } = req.body;
    if (!mongoose.isValidObjectId(postId))
      return res.status(400).send({ err: "invalid userId" });
    const post = await Post.findOne({ _id: postId }, { __v: false });
    if (password !== post.password)
      return res.status(400).send({ err: "invalid password" });
    const { title, content } = req.body;
    if (!title && !content) return res.send({ msg: "nothing is updated" });
    if (title) post.title = title;
    if (content) post.content = content;
    await post.save();

    return res.send({ msg: '게시글이 수정되었습니다.' })
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

module.exports = { postRouter };
