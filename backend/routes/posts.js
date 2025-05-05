const express = require('express');
const Post    = require('../models/Post');
const Comment = require('../models/Comment');
const User    = require('../models/User');
const router  = express.Router();

async function buildPostsFilter(req) {
  const { author, likedBy, favoritedBy, search } = req.query;
  const filterParts = [];

  if (author)      filterParts.push({ author });
  if (likedBy)     filterParts.push({ likes: likedBy });
  if (favoritedBy) filterParts.push({ favorites: favoritedBy });

  if (search) {
    const regex = new RegExp(search, 'i');
    const users = await User.find({
      $or: [
        { username: { $regex: regex } },
        { fullname: { $regex: regex } }
      ]
    }).select('_id');
    const userIds = users.map(u => u._id);
    filterParts.push({
      $or: [
        { text: { $regex: regex } },
        { author: { $in: userIds } }
      ]
    });
  }

  return filterParts.length > 0 ? { $and: filterParts } : {};
}

router.get('/', async (req, res) => {
  try {
    const filter = await buildPostsFilter(req);

    const posts = await Post.find(filter)
      .populate('author', 'username fullname')
      .sort({ createdAt: -1 })
      .lean();

    const result = posts.map(post => ({
      _id:            post._id,
      text:           post.text,
      author:         post.author,
      likesCount:     Array.isArray(post.likes)     ? post.likes.length     : 0,
      favoritesCount: Array.isArray(post.favorites) ? post.favorites.length : 0,
      createdAt:      post.createdAt,
      updatedAt:      post.updatedAt
    }));

    res.json(result);
  } catch (err) {
    console.error('Error in GET /posts:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username fullname')
      .lean();

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const formattedPost = {
      _id:            post._id,
      text:           post.text,
      author:         post.author,
      likesCount:     Array.isArray(post.likes)     ? post.likes.length     : 0,
      favoritesCount: Array.isArray(post.favorites) ? post.favorites.length : 0,
      createdAt:      post.createdAt,
      updatedAt:      post.updatedAt
    };

    let comments = await Comment.find({ post: post._id })
      .populate('author', 'username fullname')
      .sort({ createdAt: -1 })
      .lean();

    comments = comments
      .map(c => ({
        _id:        c._id,
        text:       c.text,
        author:     c.author,
        likesCount: Array.isArray(c.likes) ? c.likes.length : 0,
        createdAt:  c.createdAt,
        updatedAt:  c.updatedAt
      }))
      .sort((a, b) => b.likesCount - a.likesCount);

    return res.json({ post: formattedPost, comments });
  } catch (err) {
    console.error(`Error in GET /posts/${req.params.id}:`, err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { author, text } = req.body;
    const post = new Post({ author, text, likes: [], favorites: [] });
    await post.save();
    const populated = await post.populate('author', 'username fullname');
    return res.status(201).json({
      _id:            populated._id,
      text:           populated.text,
      author:         populated.author,
      likesCount:     0,
      favoritesCount: 0,
      createdAt:      populated.createdAt,
      updatedAt:      populated.updatedAt
    });
  } catch (err) {
    console.error('Error in POST /posts:', err);
    return res.status(400).json({ error: err.message });
  }
});

router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const idx = post.likes.indexOf(userId);
    if (idx === -1) post.likes.push(userId);
    else post.likes.splice(idx, 1);

    await post.save();
    return res.json({ likesCount: post.likes.length });
  } catch (err) {
    console.error(`Error in POST /posts/${req.params.id}/like:`, err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/favorite', async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const idx = post.favorites.indexOf(userId);
    if (idx === -1) post.favorites.push(userId);
    else post.favorites.splice(idx, 1);

    await post.save();
    return res.json({ favoritesCount: post.favorites.length });
  } catch (err) {
    console.error(`Error in POST /posts/${req.params.id}/favorite:`, err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/comments', async (req, res) => {
  try {
    const { userId, text } = req.body;
    const comment = new Comment({ author: userId, post: req.params.id, text, likes: [] });
    await comment.save();
    const populated = await comment.populate('author', 'username fullname');
    return res.status(201).json({
      _id:        populated._id,
      text:       populated.text,
      author:     populated.author,
      likesCount: 0,
      createdAt:  populated.createdAt,
      updatedAt:  populated.updatedAt
    });
  } catch (err) {
    console.error(`Error in POST /posts/${req.params.id}/comments:`, err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/comments/:commentId/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const idx = comment.likes.indexOf(userId);
    if (idx === -1) comment.likes.push(userId);
    else comment.likes.splice(idx, 1);

    await comment.save();
    return res.json({ likesCount: comment.likes.length });
  } catch (err) {
    console.error(`Error in POST /posts/comments/${req.params.commentId}/like:`, err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    await Comment.deleteMany({ post: req.params.id });
    return res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error(`Error deleting post ${req.params.id}:`, err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true }
    ).populate('author', 'username fullname');

    if (!post) return res.status(404).json({ error: 'Post not found' });
    return res.json({
      _id:            post._id,
      text:           post.text,
      author:         post.author,
      likesCount:     Array.isArray(post.likes) ? post.likes.length : 0,
      favoritesCount: Array.isArray(post.favorites) ? post.favorites.length : 0,
      createdAt:      post.createdAt,
      updatedAt:      post.updatedAt
    });
  } catch (err) {
    console.error(`Error in PUT /posts/${req.params.id}:`, err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
