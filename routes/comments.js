// express 모듈의 Router 를 Router란 이름으로 가져오기 (구조 분해)
const { Router } = require("express");
// postRouter라는 변수에 가져온 Router() 함수 할당
const commentRouter = Router();
const { Post } = require("../schemas/post");
const { Comment } = require("../schemas/comment");
const mongoose = require("mongoose");
const moment = require("moment");

// 특정 포스트에 작성된 댓글 목록 전체
commentRouter.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId))
      return res.status(400).send({ err: "invalid postId" });
    let comments = await Comment
      .find({ postId: postId }, { __v: false, password: false })
      .sort({ createdAt : -1})
    return res.send({ comments });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 특정 포스트에 댓글 작성
commentRouter.post("/:postId", async (req, res) => {
  try {
    let { comment, password } = req.body;
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId))
      return res.status(400).send({ err: "postId is invalid" });
    if (!comment) return res.status(400).send({ err: "댓글을 입력해주세요!" });
    if (!password)
      return res.status(400).send({ err: "비밀번호를 입력해주세요!" });
    let post = await Post.findById(postId);
    if (!post) res.status(400).send({ err: "user does not exist" });
    // blog 생성
    let newComment = new Comment({ ...req.body, postId:postId });
    // mongoose를 통해 comment 정보 mongoDB에 저장
    await newComment.save();
    return res.send({ msg: "댓글이 생성되었습니다." });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 댓글 삭제
commentRouter.delete("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { password } = req.body;
    if (!mongoose.isValidObjectId(commentId))
      return res.status(400).send({ err: "invalid commentId" });
    const comment = await Comment.findOne({ _id: commentId });
    if (password !== comment.password)
      return res.status(400).send({ err: "invalid password" });
    await Comment.deleteOne({ _id: commentId });
    return res.send({ msg: "댓글이 삭제되었습니다." });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 댓글 수정
commentRouter.put("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { password, comment } = req.body;
    if (!comment) return res.status(400).send({ err: "댓글을 입력해주세요!" });
    if (!password)
      return res.status(400).send({ err: "비밀번호를 입력해주세요!" });
    if (!mongoose.isValidObjectId(commentId))
      return res.status(400).send({ err: "invalid commentId" });
    const preComment = await Comment.findOne({ _id: commentId });
    if (password !== preComment.password)
      return res.status(400).send({ err: "invalid password" });
    
    let updatedBody = {};
    updatedBody.comment = comment;
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      updatedBody,
      { new: true }
    );
    // {new: true} 옵션을 추가하지 않으면 업데이트 전의 상태를 리턴한다.
    return res.send({ msg: "댓글이 수정되었습니다." });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

module.exports = { commentRouter };
