import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, PenSquare, BookOpen, Trash2, ExternalLink, LogOut } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyBlogs();
  }, [user]);

  const fetchMyBlogs = async () => {
    try {
      const res = await api.get('/blogs/my');
      setBlogs(res.data);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      setBlogs(blogs.filter(b => b._id !== id));
    } catch (err) {
      console.error('Failed to delete blog:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="page-enter dashboard-page">
      <div className="container">
        <div className="dashboard-layout">
          {/* Sidebar */}
          <motion.aside
            className="dashboard-sidebar glass"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="sidebar-user">
              <div className="sidebar-avatar">
                <User size={32} />
              </div>
              <h3>{user.username}</h3>
              <p>{user.email}</p>
            </div>

            <div className="sidebar-stats">
              <div className="sidebar-stat">
                <span className="stat-number">{blogs.length}</span>
                <span className="stat-label">Posts</span>
              </div>
            </div>

            <nav className="sidebar-nav">
              <Link to="/create" className="sidebar-link">
                <PenSquare size={16} /> Write New Post
              </Link>
              <Link to="/blogs" className="sidebar-link">
                <BookOpen size={16} /> Browse Blog
              </Link>
              <button onClick={handleLogout} className="sidebar-link sidebar-logout">
                <LogOut size={16} /> Logout
              </button>
            </nav>
          </motion.aside>

          {/* Main Content */}
          <main className="dashboard-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="dashboard-header">
                <div>
                  <h1>My <span className="glow-text">Posts</span></h1>
                  <p>Manage your blog posts</p>
                </div>
                <Link to="/create" className="btn btn-primary">
                  <PenSquare size={16} /> New Post
                </Link>
              </div>

              {loading ? (
                <div className="dashboard-posts">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius-md)' }}></div>
                  ))}
                </div>
              ) : blogs.length > 0 ? (
                <div className="dashboard-posts">
                  {blogs.map((blog, i) => (
                    <motion.div
                      key={blog._id}
                      className="dashboard-post-item card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="post-item-info">
                        <h3>{blog.title}</h3>
                        <div className="post-item-meta">
                          {blog.movieTitle && <span className="badge badge-accent">{blog.movieTitle}</span>}
                          {blog.category && <span className="badge badge-dark">{blog.category}</span>}
                          <span className="post-item-date">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="post-item-actions">
                        <Link to={`/blog/${blog._id}`} className="action-btn" title="View">
                          <ExternalLink size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="action-btn action-delete"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <PenSquare size={48} />
                  <h3>No posts yet</h3>
                  <p>Start writing your first blog post!</p>
                  <Link to="/create" className="btn btn-primary" style={{ marginTop: '16px' }}>
                    Write Your First Post
                  </Link>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
