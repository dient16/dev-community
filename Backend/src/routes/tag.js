const router = require('express').Router();
const controller = require('../controllers/tag.controller');
const { verifyAccessToken, allowNullAccessToken } = require('../middlewares/verifyToken');

router.get('/', allowNullAccessToken, controller.getTags);
router.put('/follow/:tagId', verifyAccessToken, controller.followTag);
router.put('/unfollow/:tagId', verifyAccessToken, controller.unfollowTag);
router.get('/user', verifyAccessToken, controller.getTagsUser);
router.get('/popular', controller.getPopularTags);

module.exports = router;
