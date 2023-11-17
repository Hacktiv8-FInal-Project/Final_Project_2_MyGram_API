const router = require('express').Router()
const SocialMediaController = require('../controllers/SocialMediaController')
const { authentication } = require('../middlewares/authentication')
const  authorization  = require('../middlewares/authorization');

router.post("/", authentication, SocialMediaController.createSocialMedia);
router.get("/", authentication, SocialMediaController.getSocialMedia);
router.put("/:id", authentication, authorization.socialmedia, SocialMediaController.updateSocialMedia);
router.delete("/:id", authentication, authorization.socialmedia, SocialMediaController.deleteSocialMedia);

module.exports = router