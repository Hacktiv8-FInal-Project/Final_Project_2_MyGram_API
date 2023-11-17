const router = require('express').Router()
const userRouter = require('./userRouter')
const photoRouter = require('./photoRouter')
const socialmediaRouter = require('./socialmediaRouter')

router.use('/users', userRouter)
router.use('/photos' ,photoRouter)
router.use('/socialmedia', socialmediaRouter)

module.exports = router
