import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, Calendar, Heart, Share2, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './BlogPost.css';

export default function BlogPost() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/blogs/${id}`);
      setBlog(res.data);
    } catch (err) {
      console.error('Failed to fetch blog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      navigate('/blogs');
    } catch (err) {
      console.error('Failed to delete blog:', err);
    }
  };

  if (loading) {
    return (
      <div className="page-enter blog-post-page">
        <div className="container blog-post-container">
          <div className="skeleton" style={{ height: '40px', width: '60%', margin: '0 auto 16px' }}></div>
          <div className="skeleton" style={{ height: '20px', width: '30%', margin: '0 auto 40px' }}></div>
          <div className="skeleton" style={{ height: '400px', width: '100%', borderRadius: 'var(--radius-lg)' }}></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="page-enter blog-post-page" style={{ textAlign: 'center' }}>
        <h2>Blog post not found</h2>
        <Link to="/blogs" className="btn btn-secondary" style={{ marginTop: '20px' }}>
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </div>
    );
  }

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    : '';

  const isOwner = user && blog.author && (user._id === blog.author._id || user.id === blog.author._id);

  return (
    <div className="page-enter blog-post-page">
      <div className="container blog-post-container">
        <Link to="/blogs" className="back-link">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        <motion.article
          className="blog-post-article"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="blog-post-header">
            <div className="blog-post-tags">
              {blog.movieTitle && <span className="badge badge-accent">{blog.movieTitle}</span>}
              {blog.category && <span className="badge badge-dark">{blog.category}</span>}
            </div>

            <h1 className="blog-post-title">{blog.title}</h1>

            <div className="blog-post-meta">
              <div className="blog-post-author-info">
                <div className="author-avatar"><User size={16} /></div>
                <div>
                  <span className="author-name">{blog.authorName || blog.author?.username || 'Anonymous'}</span>
                  <span className="author-email">{blog.authorEmail || blog.author?.email}</span>
                  <span className="post-date"><Calendar size={12} /> {formattedDate}</span>
                </div>
              </div>

              <div className="blog-post-actions">
                <button className="action-btn" title="Share">
                  <Share2 size={16} />
                </button>
                <button className="action-btn" title="Like">
                  <Heart size={16} />
                </button>
                {(isOwner || user) && (
                  <button className="action-btn action-delete visible" onClick={handleDelete} title="Delete Post">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {blog.coverImage && (
            <div className="blog-post-cover">
              <img src={blog.coverImage} alt={blog.title} />
            </div>
          )}

          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <section className="author-bio-section card glass">
            <div className="author-avatar-large"><User size={32} /></div>
            <div className="author-bio-content">
              <h4>About the Author</h4>
              <p className="author-bio-name">{blog.author?.username || 'Guest Writer'}</p>
              <p className="author-bio-email">{blog.author?.email}</p>
              <p className="author-bio-tagline">
                Regular contributor to CineBlog. Sharing insights and deep dives into the world of cinema.
              </p>
            </div>
          </section>
        </motion.article>
      </div>
    </div>
  );
}
