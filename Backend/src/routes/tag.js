const router = require('express').Router();
const controller = require('../controllers/tag.controller');
const { verifyAccessToken } = require('../middlewares/verifyToken');

router.get('/', controller.getTags);
router.put('/follow/:tagId', verifyAccessToken, controller.followTag);
router.put('/unfollow/:tagId', verifyAccessToken, controller.unfollowTag);
router.get('/user', verifyAccessToken, controller.getTagsUser);
router.get('/popular', controller.getPopularTags);

module.exports = router;
