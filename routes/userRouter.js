const router = require('express').Router()
const UserController = require('../controllers/UserController')
const { authentication } = require('../middlewares/authentication')
const  authorization  = require('../middlewares/authorization')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.put('/:id', authentication, authorization.user, UserController.update)
router.delete('/:id', authentication, authorization.user, UserController.destroy)

module.exports = router
