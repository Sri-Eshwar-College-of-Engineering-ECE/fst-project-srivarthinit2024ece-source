import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Filter } from 'lucide-react';
import api from '../../services/api';
import BlogCard from '../../components/BlogCard/BlogCard';
import './BlogList.css';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  const categories = ['All', 'Review', 'Analysis', 'News', 'Opinion', 'List'];

  useEffect(() => {
    fetchBlogs();
  }, [category]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = category && category !== 'All' ? { category } : {};
      const res = await api.get('/blogs', { params });
      setBlogs(res.data);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter blog-list-page">
      <div className="blog-list-header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-label"><BookOpen size={14} /> Blog</span>
            <h1 className="blog-list-title">
              Latest <span className="glow-text">Blog Posts</span>
            </h1>
            <p className="blog-list-subtitle">
              Discover reviews, analyses, and discussions from our community
            </p>
          </motion.div>

          <div className="blog-filters">
            <Filter size={16} className="filter-icon" />
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${(category === '' && cat === 'All') || category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat === 'All' ? '' : cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '80px' }}>
        {loading ? (
          <div className="blog-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '380px', borderRadius: 'var(--radius-lg)' }}></div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="blog-grid">
            {blogs.map((blog, i) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <BookOpen size={48} />
            <h3>No blog posts found</h3>
            <p>Try a different category or check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
}
