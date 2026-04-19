import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    default: '',
  },
  movieTitle: {
    type: String,
    default: '',
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
  },
  category: {
    type: String,
    enum: ['Review', 'Analysis', 'News', 'Opinion', 'List'],
    default: 'Review',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  authorName: {
    type: String,
    trim: true,
  },
  authorEmail: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

// Text search index
blogSchema.index({ title: 'text', content: 'text', movieTitle: 'text' });

export default mongoose.model('Blog', blogSchema);
