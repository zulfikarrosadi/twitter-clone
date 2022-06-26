const errorHanlder = require('../utils/errorHanlder');
const { getCursor } = require('../utils/tweetUtils');
const {
  createComment,
  getAllCommentsByIdTweet,
  getInfinteCommentByCursor,
  deleteCommentById,
} = require('../services/commentService');
const getTimelapse = require('../utils/timeUtil');
const { RequestError } = require('../errors/RequestError');

const addComment = async (req, res) => {
  const beforeTime = new Date().getTime();
  const idTweet = parseInt(req.params.idTweet, 10);

  const { comment } = req.body;
  const { userId } = req.user;

  if (!comment) throw Error('comment is empty');

  try {
    const result = await createComment(idTweet, comment, userId);
    if (result.code === 'P2003') throw Error('Foreign key error');

    const timelapse = getTimelapse(beforeTime);

    return res.status(201).json({
      timelapse: `${timelapse} ms`,
      cursor: null,
      comment: result,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      timelapse: null,
      cursor: null,
      comment: null,
      error: errorHanlder(error.message),
    });
  }
};

const getComments = async (req, res) => {
  const beforeTime = new Date().getTime();
  const idTweet = parseInt(req.params.idTweet, 10);
  try {
    const result = await getAllCommentsByIdTweet(idTweet);
    if (!result.length) throw RequestError('Comment not found', 404);

    const timelapse = getTimelapse(beforeTime);

    return res.status(200).json({
      timelapse: `${timelapse} ms`,
      cursor: getCursor(result),
      comment: result,
      error: null,
    });
  } catch (error) {
    return res.status(404).json({
      timelapse: null,
      cursor: null,
      comment: null,
      error: error.message,
    });
  }
};

const getInfinteComment = async (req, res) => {
  const beforeTime = new Date().getTime();
  const idTweet = parseInt(req.params.idTweet, 10);
  const cursor = parseInt(req.params.cursor, 10);

  try {
    const result = await getInfinteCommentByCursor(idTweet, cursor);
    if (!result.length) throw Error('Comment not found');

    const timelapse = getTimelapse(beforeTime);

    return res.status(200).json({
      timelapse: `${timelapse} ms`,
      cursor: getCursor(result),
      comment: result,
      error: null,
    });
  } catch (error) {
    return res.status(404).json({
      timelapse: null,
      cursor: null,
      comment: null,
      error: errorHanlder(error.message),
    });
  }
};

const deleteComment = async (req, res) => {
  const beforeTime = new Date().getTime();
  const idTweet = parseInt(req.params.idTweet, 10);
  const idComment = parseInt(req.params.idComment, 10);
  try {
    const result = await deleteCommentById(idTweet, idComment);
    if (result.code === 'P2025') throw Error('Comment not found');

    const timelapse = getTimelapse(beforeTime);

    return res.status(200).json({
      timelapse: `${timelapse} ms`,
      cursor: null,
      comment: result,
      error: null,
    });
  } catch (error) {
    return res.status(404).json({
      timelapse: null,
      cursor: null,
      comment: null,
      error: errorHanlder(error.message),
    });
  }
};

module.exports = {
  addComment,
  getComments,
  getInfinteComment,
  deleteComment,
};
