const router = require('express').Router();
const controller = require('../controllers/comment.controller');
const { verifyAccessToken } = require('../middlewares/verifyToken');

router.post('/:postId', verifyAccessToken, controller.createComment);
router.get('/reply/:commentId', verifyAccessToken, controller.getRepliedByPostId);

module.exports = router;
