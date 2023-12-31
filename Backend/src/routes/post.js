const router = require('express').Router();
const controller = require('../controllers/post.controller');
const { verifyAccessToken, allowNullAccessToken } = require('../middlewares/verifyToken');
const uploader = require('../middlewares/uploadFile');
const { validateRequest } = require('../middlewares/validation');
const { postSchema } = require('../utils/validation');
router.get('/', allowNullAccessToken, controller.getPosts);
router.get('/search', controller.searchPost);
router.get('/tag-discuss', controller.getPostByTagsDiscuss);
router.get('/bookmark', verifyAccessToken, controller.getBookmarkUser);
router.get('/:pid', allowNullAccessToken, controller.getPost);
router.post('/', verifyAccessToken, uploader.single('image'), validateRequest(postSchema), controller.createPost);
router.delete('/:postId', [verifyAccessToken], controller.deletePost);
router.put('/:postId', verifyAccessToken, uploader.single('image'), controller.updatePost);
router.post('/upload-image', verifyAccessToken, uploader.single('image'), controller.uploadImage);
router.put('/like/:postId', verifyAccessToken, controller.likePost);
router.put('/unlike/:postId', verifyAccessToken, controller.unlikePost);
router.put('/bookmark/:postId', verifyAccessToken, controller.bookmarkPost);
router.put('/unbookmark/:postId', verifyAccessToken, controller.unbookmarkPost);

module.exports = router;
