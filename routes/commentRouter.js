const router = require('express').Router();
const CommentController = require('../controllers/CommentController');
const { authentication } = require('../middlewares/authentication');
const  authorization  = require('../middlewares/authorization');

router.get("/", authentication, CommentController.getAllComments);
router.post("/", authentication, CommentController.createComment);
router.put("/:id", authentication, authorization.comment, CommentController.updateComment);
router.delete("/:id", authentication, authorization.comment, CommentController.deleteComment);

module.exports = router;