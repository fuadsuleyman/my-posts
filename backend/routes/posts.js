const express = require('express');

const router = express.Router();

const postsControllers = require('../controllers/posts');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

// update request
router.put("/:id",
  checkAuth,
  extractFile, postsControllers.updatePost);

router.get("/:id", postsControllers.getPost);

// post request
router.post("",
  checkAuth,
  extractFile, postsControllers.creatPosts);

// this is GET request, use evezine get de yazmaq olar
// changes app.use ni app.get ile evez eledim
// paginator logic here
// skip is skip previus pages
router.get("", postsControllers.getPosts);

// delete request
router.delete("/:id", checkAuth, postsControllers.deletePost);

module.exports = router;
