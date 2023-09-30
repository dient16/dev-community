const router = require('express').Router();
const controller = require('../controllers/post.controller');
const { verifyAccessToken, verifyIsAdmin } = require('../middlewares/verifyToken');
const uploader = require('../middlewares/uploadFile');
router.get('/', controller.getPosts);
router.post('/', verifyAccessToken, uploader.single('image'), controller.createPost);
router.delete('/:postId', [verifyAccessToken], controller.deletePost);
router.put('/:postId', verifyAccessToken, controller.updatePost);
// router.post('/forgot-password', controller.forgotPassword);
// router.put('/reset-password', controller.resetPassword);
// router.get('/', [verifyAccessToken, isAdmin], controller.getUsers);

// router.put('/current', [verifyAccessToken], controller.updateUser);
// router.put('/address', [verifyAccessToken], controller.updateAddress);
// router.put('/cart', [verifyAccessToken], controller.updateCart);
// router.put('/:uid', [verifyAccessToken, isAdmin], controller.updateUserByAdmin);

module.exports = router;
