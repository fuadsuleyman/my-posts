const express = require('express');

const router = express.Router();

const Post = require('../models/post');

// update request
router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
});
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(201).json({message: 'Updated successful!'})
  })
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  })
})

// post request
router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id})
  });
})

// this is GET request, use evezine get de yazmaq olar
// changes app.use ni app.get ile evez eledim
router.get("", (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: documents
    })
  })
});

// delete request
router.delete("/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    console.log(req.params.id);
    res.status(200).json({ message: "Post deleted!"});
  })
});


module.exports = router;
