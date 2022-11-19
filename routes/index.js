const express = require('express');
const indexRouter = express.Router();
const { postRouter } = require("./posts");
const { commentRouter } = require("./comments");

indexRouter.use('/posts', postRouter)
indexRouter.use('/comments', commentRouter)

module.exports = { indexRouter };
