import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Sparkles, ArrowRight, Play, Star, Film } from 'lucide-react';
import api from '../../services/api';
import MovieCard from '../../components/MovieCard/MovieCard';
import BlogCard from '../../components/BlogCard/BlogCard';
import './Home.css';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = searchQuery ? { search: searchQuery } : {};
      const [moviesRes, blogsRes] = await Promise.all([
        api.get('/movies', { params }),
        api.get('/blogs', { params }),
      ]);
      setMovies(moviesRes.data);
      setBlogs(blogsRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const featuredMovie = movies.length > 0 ? movies[0] : null;

  return (
    <div className="page-enter">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-gradient-orb orb-1"></div>
          <div className="hero-gradient-orb orb-2"></div>
          <div className="hero-gradient-orb orb-3"></div>
          <div className="hero-grid-pattern"></div>
        </div>

        <div className="container hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label">
              <Sparkles size={14} /> Welcome to CineBlog
            </span>
            <h1 className="hero-title">
              Discover, Review &<br />
              <span className="glow-text">Share Cinema</span>
            </h1>
            <p className="hero-description">
              Dive into the world of movies. Read reviews, share your thoughts,
              and connect with fellow cinema enthusiasts.
            </p>
            <div className="hero-actions">
              <Link to="/blogs" className="btn btn-primary">
                <Play size={16} /> Explore Posts
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Join Community <ArrowRight size={16} />
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">{movies.length}+</span>
                <span className="hero-stat-label">Movies</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="hero-stat-number">{blogs.length}+</span>
                <span className="hero-stat-label">Reviews</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="hero-stat-number glow-gold">4.8</span>
                <span className="hero-stat-label">Avg Rating</span>
              </div>
            </div>
          </motion.div>

          {featuredMovie && (
            <motion.div
              className="hero-featured"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="featured-card glass">
                <img
                  src={featuredMovie.posterUrl || `https://placehold.co/400x600/1a1a2e/e53e3e?text=${encodeURIComponent(featuredMovie.title)}`}
                  alt={featuredMovie.title}
                  className="featured-poster"
                />
                <div className="featured-info">
                  <span className="badge badge-accent">Featured</span>
                  <h3>{featuredMovie.title}</h3>
                  {featuredMovie.rating && (
                    <div className="featured-rating">
                      <Star size={14} fill="currentColor" className="star" />
                      <span className="glow-gold">{featuredMovie.rating.toFixed(1)}</span>
                    </div>
                  )}
                  <Link to={`/movie/${featuredMovie._id}`} className="btn btn-primary btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* SEARCH RESULTS */}
      {searchQuery && (
        <section className="section">
          <div className="container">
            <div className="section-header" style={{ textAlign: 'left' }}>
              <h2>Search results for "<span className="glow-text">{searchQuery}</span>"</h2>
              <p>{movies.length + blogs.length} results found</p>
            </div>
          </div>
        </section>
      )}

      {/* TRENDING MOVIES */}
      <section className="section" id="trending-movies">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-label"><TrendingUp size={14} /> Trending Now</span>
            <h2>Popular Movies</h2>
            <p>Explore the hottest movies everyone is talking about</p>
          </motion.div>

          {loading ? (
            <div className="movies-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton" style={{ aspectRatio: '2/3', borderRadius: 'var(--radius-md)' }}></div>
              ))}
            </div>
          ) : movies.length > 0 ? (
            <>
              <div className="movies-grid">
                {movies.slice(0, 8).map((movie, i) => (
                  <motion.div
                    key={movie._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </div>
              {movies.length > 8 && (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                  <Link to="/?showAll=true" className="btn btn-secondary">
                    View All Movies <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <Film size={48} />
              <h3>No movies yet</h3>
              <p>Check back soon for new additions!</p>
            </div>
          )}
        </div>
      </section>

      {/* LATEST BLOGS */}
      <section className="section" id="latest-blogs" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-label"><Sparkles size={14} /> Fresh Content</span>
            <h2>Latest Blog Posts</h2>
            <p>Read the latest reviews and thoughts from our community</p>
          </motion.div>

          {loading ? (
            <div className="blog-grid">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '350px', borderRadius: 'var(--radius-lg)' }}></div>
              ))}
            </div>
          ) : blogs.length > 0 ? (
            <>
              <div className="blog-grid">
                {blogs.slice(0, 6).map((blog, i) => (
                  <motion.div
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <BlogCard blog={blog} />
                  </motion.div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Link to="/blogs" className="btn btn-primary">
                  View All Posts <ArrowRight size={16} />
                </Link>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <Sparkles size={48} />
              <h3>No blog posts yet</h3>
              <p>Be the first to write one!</p>
              <Link to="/create" className="btn btn-primary" style={{ marginTop: '16px' }}>
                Write a Post
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
