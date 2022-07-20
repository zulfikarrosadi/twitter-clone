const { Router } = require('express');
const formData = require('express-form-data');
const {
  addComment,
  getComments,
  getInfinteComment,
  deleteComment,
} = require('../controllers/commentController');
const requiredLogin = require('../middlewares/requiredLogin');
const isUrlParamInt = require('../middlewares/validateUrlParam');

const router = Router();

router.use(isUrlParamInt);
router.use(formData.parse());

router.get('/:idTweet', getComments);
router.get('/:idTweet/:cursor', getInfinteComment);

router.use('/', requiredLogin);

router.post('/:idTweet', addComment);
router.delete('/:idComment', deleteComment);

module.exports = router;
