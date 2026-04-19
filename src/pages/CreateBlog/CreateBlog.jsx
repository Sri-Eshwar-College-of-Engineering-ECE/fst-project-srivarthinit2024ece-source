import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PenSquare, Image, Tag, Film, User } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './CreateBlog.css';

export default function CreateBlog() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    content: '',
    movieTitle: '',
    category: 'Review',
    coverImage: '',
    authorName: user?.username || '',
    authorEmail: user?.email || '',
  });

  const categories = ['Review', 'Analysis', 'News', 'Opinion', 'List'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/blogs', form);
      navigate(`/blog/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="page-enter create-blog-page">
      <div className="container create-blog-container">
        <motion.div
          className="create-blog-form-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="create-blog-header">
            <span className="section-label"><PenSquare size={14} /> New Post</span>
            <h1>Write a <span className="glow-text">Blog Post</span></h1>
            <p>Share your thoughts about a movie with the community</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="create-blog-form">
            <div className="form-group">
              <label className="form-label">Post Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter an engaging title..."
                id="create-title"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label"><Film size={14} /> Movie Title</label>
                <input
                  type="text"
                  name="movieTitle"
                  value={form.movieTitle}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Which movie is this about?"
                  id="create-movie"
                />
              </div>

              <div className="form-group">
                <label className="form-label"><Tag size={14} /> Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="form-input"
                  id="create-category"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label"><User size={14} /> Author Name</label>
                <input
                  type="text"
                  name="authorName"
                  value={form.authorName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Your Name"
                  id="create-author-name"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Author Email</label>
              <input
                type="email"
                name="authorEmail"
                value={form.authorEmail}
                onChange={handleChange}
                className="form-input"
                placeholder="your.email@example.com"
                id="create-author-email"
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Image size={14} /> Cover Image URL</label>
              <input
                type="url"
                name="coverImage"
                value={form.coverImage}
                onChange={handleChange}
                className="form-input"
                placeholder="https://example.com/image.jpg"
                id="create-cover"
              />
              {form.coverImage && (
                <div className="cover-preview">
                  <img src={form.coverImage} alt="Cover preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Content * (HTML supported)</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                className="form-input"
                placeholder="Write your blog post here... You can use HTML tags for formatting."
                rows="14"
                id="create-content"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary create-submit"
              disabled={loading}
              id="create-submit"
            >
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
