const router = require('express').Router();
const controller = require('../controllers/controller');
const passport = require('passport');

router.get('/', controller.home);
router.get('/panel',controller.panel);
router.post('/upNoticia',controller.upNoticia);
router.post('/deleteNew',controller.deleteNew);
router.post('/deleteBlog',controller.deleteBlog);
router.post('/deleteMedia',controller.deleteMedia);
router.post('/updateBlog',controller.updateBlog);
router.post('/deleteService',controller.deleteService);
router.post('/upPregunta',controller.upPregunta);
router.get('/login',controller.login);
router.post('/login', passport.authenticate('local', {

    successRedirect: "/panel",
    failureRedirect: "/login",
}));
router.get('/logout',controller.logOut);
router.post('/getGaleria',controller.gatGaleria);
router.post('/upMedia',controller.upGaleria);
router.post('/deleteUser',controller.deleteUser);
router.get('/galeria',controller.galeria);
router.post('/upUser',controller.upUser);
router.post('/upService',controller.upService);
router.all('*',controller.all);


module.exports = router;

