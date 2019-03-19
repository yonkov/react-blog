const router = require('express').Router();
const feedController = require('../controllers/feed');
const isAdmin = require('../middleware/is-auth');

router.get('/posts', feedController.getposts);
router.post('/post/create', isAdmin, feedController.createPost);

router.get('/post/edit/:id', isAdmin, feedController.editGet);
router.post('/post/edit/:id', isAdmin, feedController.editPost);

router.get('/post/delete/:id', isAdmin, feedController.deleteGet);
router.post('/post/delete/:id', isAdmin, feedController.deletePost);

router.post('/comment/create', feedController.createComment);

module.exports = router;