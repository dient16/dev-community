const router = require('express').Router();
const controller = require('../controllers/comment.controller');
const { verifyAccessToken, allowNullAccessToken } = require('../middlewares/verifyToken');
const { validateRequest } = require('../middlewares/validation');
const { commentSchema } = require('../utils/validation');

router.post('/:postId', validateRequest(commentSchema), verifyAccessToken, controller.createComment);
router.put('/like/:commentId', verifyAccessToken, controller.likeComment);
router.put('/unlike/:commentId', verifyAccessToken, controller.unlikeComment);
router.get('/:postId', allowNullAccessToken, controller.getCommentsByPostId);
router.get('/reply/:commentId', allowNullAccessToken, controller.getRepliedByParentId);
router.delete('/:commentId', verifyAccessToken, controller.deleteComment);

module.exports = router;
