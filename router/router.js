const express = require("express");

const router = express.Router();


const db = require('../data/db.js')

// Get posts
router.get('/', (req,res) => {
    db.find()
    .then(posts =>{
        res.json({posts: posts})
    })
    .catch(error => {
        res.status(500).json({ error: "The posts information could not be retrieved."  })
    });
})

//Get posts by id
router.get('/:id', (req,res)=>{
    
    db.findById(req.params.id)
    .then(post =>{
        if(post.length == 0){
        res.status(404).json({error: "The post with the specified ID does not exist."})
    } else {
        res.status(200).json({post: post})
    }
    })
    .catch(error => {
        res.status(404).json({message: "The post with the specified ID does not exist." })
    })
})

//Get comments by id
router.get('/:id/comments', (req,res)=>{

      db.findPostComments(req.params.id)
      .then(comments =>{
         if(comments.length == 0){
             res.status(404).json({message: "The post with the specified ID does not exist." })
          }else{
              res.status(200).json(comments);
          }
          
      })
      .catch(error => {
          
          res.status(500).json({ error: "The comments information could not be retrieved." })
      })
})

//Post a comment
router.post('/', (req, res) => {
   
    if(!req.body.title || !req.body.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post."})
    } else {
         db.insert(req.body)
         .then(post => {
              res.status(201).json(post)
         })
         .catch(error => {
             res.status(500).json({ error: "There was an error while saving the post to the database"})
         })
    }
})

//Post a comment
router.post('/:id/comments', (req, res) => {
    const id = req.params.id
    comment = req.body
    comment.post_id = id

    if(!req.body.text){
        res.status(404).json({message: "The post with the specified ID does not exist."})
    } else if(req.body.text){ 
        db.insertComment(comment)
        .then(comment => {
            res.status(201).json(comment)
        }).catch(error => {
            res.status(500).json({error: "The post could not be removed"})
        })
    }
})

//Update post
router.put('/:id', (req, res) => {
    
    if(!req.body.title || !req.body.contents){
        res.status(400).json({message: "provide a title and contents for the post." })
    } else {
        db.update(req.params.id, req.body)
        .then(post => {
            if (req.body) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist, please try again." })
            }
        }).catch(error => {
            res.status(500).json({ error: "The post information could not be modified" })
        })
    }
})

//Delete a post
router.delete('/:id', (req,res)=>{

  db.findById(req.params.id)

  .then(post =>{
      db.remove(req.params.id)
      .then(deletePost =>{ 
              res.status(200).json(post);
      })
      .catch(error =>{
          res.status(500).json({ error: "The comments information could not be retrieved." })
      })
  })
  .catch(error => {
      res.status(404).json({message: "The post with the specified ID does not exist." })
  })
})

module.exports = router