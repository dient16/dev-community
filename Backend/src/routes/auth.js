const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const { verifyAccessToken } = require('../middlewares/verifyToken');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/logout', controller.logout);
router.post('/refresh-token', controller.refreshAccessToken);
//router.get('/current-user', verifyAccessToken, controller.getCurrent);
// router.get('/final-register/:token', controller.finalRegister);

// router.post('/forgot-password', controller.forgotPassword);
// router.put('/reset-password', controller.resetPassword);
// router.get('/', [verifyAccessToken, isAdmin], controller.getUsers);
// router.delete('/:uid', [verifyAccessToken, isAdmin], controller.deleteUser);
// router.put('/current', [verifyAccessToken], controller.updateUser);
// router.put('/address', [verifyAccessToken], controller.updateAddress);

module.exports = router;
