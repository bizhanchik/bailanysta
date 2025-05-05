require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');

const app = express();


app.use(cors());
app.use(express.json());


app.use('/users', userRoutes);
app.use('/posts', postRoutes);


const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5001;

mongoose.set('strictQuery', true); 
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB error:', err.message);
  });
