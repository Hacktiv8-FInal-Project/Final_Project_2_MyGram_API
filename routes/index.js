const router = require('express').Router()
const userRouter = require('./userRouter')
const photoRouter = require('./photoRouter')
const socialmediaRouter = require('./socialmediaRouter')
const commentRouter = require('./commentRouter')

router.use('/users', userRouter)
router.use('/photos' ,photoRouter)
router.use('/socialmedias', socialmediaRouter)
router.use('/comments', commentRouter)

module.exports = router
