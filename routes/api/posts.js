const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const User = require('../../models/User');

// @route   POST api/posts
// @desc    Create a post 
// @access  Private

router.post(
    '/',
    [
        auth,
        [
            check('text', 'Enter text for post').not().isEmpty()
        ]
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        try {
            const user = await User.findById(req.user.id).select('-password');
            const newPost = await new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            });
            const post = await newPost.save();
            res.json(post);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }

    });

// @route   GET api/posts
// @desc    Get all posts
// @access  Private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/posts/:id
// @desc    Get posts by ID
// @access  Private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   Delete api/posts/:id
// @desc    Delete posts by ID
// @access  Private

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json('Post not found'); 
        }

        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorised" });
        }

        await post.remove();

        res.json({ msg: 'Post Removed' });
    } catch(err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/posts/like/:id
// @desc    Add Likes to Post
// @access  Private

router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if the post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Already liked the Post' });
        }

        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/posts/unlike/:id
// @desc    Remove Likes to Post
// @access  Private

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);

        // Check if the post is like by user 
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post not liked' });
        }

        const updatedLikes = post.likes.filter(like => like.user.toString() !== req.user.id);
        post.likes = updatedLikes;
        await post.save();
        res.json(post.likes);

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/posts/comment/:id
// @desc    Add comment to Post
// @access  Private

router.post(
    '/comment/:id', 
    [
        auth,
        [
            check('text', 'Enter text for post').not().isEmpty()
        ]
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
       
        try{
            const user = await User.findById(req.user.id).select('-password');

            const newComment = {};
            newComment.user = req.user.id;
            newComment.text = req.body.text;
            newComment.name = user.name;
            newComment.avatar = user.avatar;

            const post = await Post.findById(req.params.id);
            
            // Check if the user has alreaddy commented
            // if( post.comments.filter(comment => comment.user.toString() === req.user.id).length > 0 ) {

            // }

            post.comments.unshift(newComment);
            await post.save();

            res.status(200).json(post.comments);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

});

// @route   DELETE api/posts/comment/:post_id/:comment_id
// @desc    Delete comment to Post
// @access  Private

router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        //  Alternative way
        // const comment = post.comments.filter(comment => comment.id === req.params.comment_id);

        // if (comment[0].user.toString() !== req.user.id) {
        //     return res.status(404).json({ msg: 'User not authorised' });
        // }

        // const updatedComments = post.comments.filter(comment => comment.id !== req.params.comment_id);
        // post.comments = updatedComments;

        // One way

        // Pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        // Make sure comment exists
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exists' });
        }

        // Check user 
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorised' });
        }

        // Get remove index
        const removeIndex = post.comments
            .map(comment => comment.user.toString())
            .indexOf(req.user.id);
        
        post.comments.splice(removeIndex, 1);    

        await post.save();
        res.status(200).json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;