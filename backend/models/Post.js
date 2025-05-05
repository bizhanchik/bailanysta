const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:      { type: String, required: true },
  likes:     { 
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    default: [] 
  },
  favorites: { 
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    default: [] 
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
