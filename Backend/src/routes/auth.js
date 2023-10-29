const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const { validateRequest } = require('../middlewares/validation');
const { userLoginSchema, userSchema } = require('../utils/validation');

router.post('/register', validateRequest(userSchema), controller.register);
router.post('/login', validateRequest(userLoginSchema), controller.login);
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
