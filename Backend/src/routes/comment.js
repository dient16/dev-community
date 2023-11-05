const router = require('express').Router();
const controller = require('../controllers/comment.controller');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const { validateRequest } = require('../middlewares/validation');
const { commentSchema } = require('../utils/validation');

router.post('/:postId', validateRequest(commentSchema), verifyAccessToken, controller.createComment);
router.get('/reply/:commentId', verifyAccessToken, controller.getRepliedByParentId);

module.exports = router;
