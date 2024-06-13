const router = require('express').Router();
const { verifyAccessToken } = require('../middlewares/verifyToken');
const controller = require('../controllers/auth.controller');
const { validateRequest } = require('../middlewares/validation');
const { userLoginSchema } = require('../utils/validation');

router.post('/register', validateRequest(userLoginSchema), controller.register);
router.post('/login', validateRequest(userLoginSchema), controller.login);
router.get('/logout', verifyAccessToken, controller.logout);
router.post('/refresh-token', verifyAccessToken, controller.refreshAccessToken);

module.exports = router;
