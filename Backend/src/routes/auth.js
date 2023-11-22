const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const { validateRequest } = require('../middlewares/validation');
const { userLoginSchema } = require('../utils/validation');

router.post('/register', validateRequest(userLoginSchema), controller.register);
router.post('/login', validateRequest(userLoginSchema), controller.login);
router.get('/logout', controller.logout);
router.post('/refresh-token', controller.refreshAccessToken);

module.exports = router;
