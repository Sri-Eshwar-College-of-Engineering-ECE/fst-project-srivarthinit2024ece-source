import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  posterUrl: {
    type: String,
    default: '',
  },
  trailerUrl: {
    type: String,
    default: '',
  },
  genre: {
    type: String,
    default: '',
  },
  year: {
    type: Number,
  },
  director: {
    type: String,
    default: '',
  },
  cast: {
    type: String,
    default: '',
  },
  duration: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
}, { timestamps: true });

// Text search index
movieSchema.index({ title: 'text', description: 'text', genre: 'text' });

export default mongoose.model('Movie', movieSchema);
