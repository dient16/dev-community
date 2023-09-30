const router = require('express').Router();
const controller = require('../controllers/comment.controller');
const { verifyAccessToken } = require('../middlewares/verifyToken');

router.post('/', verifyAccessToken, controller.createComment);

module.exports = router;
