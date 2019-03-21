const router = require('express').Router();
const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

router.get('/posts', feedController.getposts);
router.post('/post/create', isAdmin, feedController.createPost);

router.get('/post/edit/:id', isAdmin, feedController.editGet);
router.post('/post/edit/:id', isAdmin, feedController.editPost);

router.get('/post/delete/:id', isAdmin, feedController.deleteGet);
router.post('/post/delete/:id', isAdmin, feedController.deletePost);

router.post('/comment/create', isAuth, feedController.createComment);

module.exports = router;