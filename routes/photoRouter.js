const router = require('express').Router();
const PhotoController = require('../controllers/PhotoController');
const { authentication } = require('../middlewares/authentication');
const  authorization  = require('../middlewares/authorization');



router.post('/',authentication, PhotoController.postPhoto);
router.get('/',authentication, PhotoController.getPhotos);
router.put('/:id',authentication,authorization.photo, PhotoController.updatePhoto); 
router.delete('/:id',authentication,authorization.photo, PhotoController.deletePhoto); 

module.exports = router;
