const router = require('express').Router();
const controller = require('../controllers/user.controller');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const uploader = require('../middlewares/uploadFile');

router.get('/current-user', verifyAccessToken, controller.getCurrentUser);
router.put('/:uid', verifyAccessToken, uploader.single('image'), controller.editUser);

module.exports = router;
