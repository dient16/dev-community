const router = require('express').Router();
const controller = require('../controllers/user.controller');
const { verifyAccessToken } = require('../middlewares/verifyToken');

router.get('/current-user', verifyAccessToken, controller.getCurrentUser);
// router.get('/final-register/:token', controller.finalRegister);
// router.post('/refresh-token', controller.refreshAccessToken);
// router.get('/logout', controller.logout);
// router.post('/forgot-password', controller.forgotPassword);
// router.put('/reset-password', controller.resetPassword);
// router.get('/', [verifyAccessToken, isAdmin], controller.getUsers);
// router.delete('/:uid', [verifyAccessToken, isAdmin], controller.deleteUser);
// router.put('/current', [verifyAccessToken], controller.updateUser);
// router.put('/address', [verifyAccessToken], controller.updateAddress);
// router.put('/cart', [verifyAccessToken], controller.updateCart);
// router.put('/:uid', [verifyAccessToken, isAdmin], controller.updateUserByAdmin);

module.exports = router;
