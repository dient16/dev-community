const router = require('express').Router();
const controller = require('../controllers/post.controller');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const uploader = require('../middlewares/uploadFile');
router.get('/', controller.getPosts);
router.get('/:pid', controller.getPost);
router.post('/', verifyAccessToken, uploader.single('image'), controller.createPost);
router.delete('/:postId', [verifyAccessToken], controller.deletePost);
router.put('/:postId', verifyAccessToken, controller.updatePost);

module.exports = router;
