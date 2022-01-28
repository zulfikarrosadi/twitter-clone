const errorHanlder = require('../utils/errorHanlder');
const { createComment } = require('../services/commentService');

const addComment = async (req, res) => {
  const beforeTime = new Date().getTime();
  const idTweet = parseInt(req.params.idTweet, 10);
  const { comment } = req.body;
  try {
    const result = await createComment(idTweet, comment);
    if (result.code === 'P2003') throw Error('Foreign key error');

    const afterTime = new Date().getTime();
    const timelapse = afterTime - beforeTime;

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

module.exports = { addComment };
