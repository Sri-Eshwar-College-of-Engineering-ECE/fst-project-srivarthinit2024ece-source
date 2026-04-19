import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Calendar, Clock, Tag, ArrowLeft, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import BlogCard from '../../components/BlogCard/BlogCard';
import './MovieDetails.css';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    setLoading(true);
    try {
      const [movieRes, blogsRes] = await Promise.all([
        api.get(`/movies/${id}`),
        api.get(`/blogs?movieId=${id}`),
      ]);
      setMovie(movieRes.data);
      setRelatedBlogs(blogsRes.data);
    } catch (err) {
      console.error('Failed to fetch movie:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-enter" style={{ paddingTop: '100px' }}>
        <div className="container">
          <div className="movie-detail-skeleton">
            <div className="skeleton" style={{ width: '300px', aspectRatio: '2/3', borderRadius: 'var(--radius-lg)' }}></div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="skeleton" style={{ height: '40px', width: '60%' }}></div>
              <div className="skeleton" style={{ height: '20px', width: '40%' }}></div>
              <div className="skeleton" style={{ height: '120px', width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="page-enter" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <div className="container">
          <h2>Movie not found</h2>
          <Link to="/" className="btn btn-secondary" style={{ marginTop: '20px' }}>
            <ArrowLeft size={16} /> Back Home
          </Link>
        </div>
      </div>
    );
  }

  const rating = movie.rating || 0;

  return (
    <div className="page-enter">
      {/* Backdrop */}
      <div className="movie-backdrop">
        <img
          src={movie.posterUrl || `https://placehold.co/1200x600/1a1a2e/e53e3e?text=${encodeURIComponent(movie.title)}`}
          alt=""
        />
        <div className="movie-backdrop-overlay"></div>
      </div>

      <div className="container movie-detail-container">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="movie-detail-layout">
          <motion.div
            className="movie-poster-wrapper"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={movie.posterUrl || `https://placehold.co/400x600/1a1a2e/e53e3e?text=${encodeURIComponent(movie.title)}`}
              alt={movie.title}
              className="movie-detail-poster"
            />
          </motion.div>

          <motion.div
            className="movie-detail-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="movie-detail-badges">
              {movie.genre && <span className="badge badge-accent">{movie.genre}</span>}
              {movie.year && <span className="badge badge-dark"><Calendar size={11} /> {movie.year}</span>}
              {movie.duration && <span className="badge badge-dark"><Clock size={11} /> {movie.duration}</span>}
            </div>

            <h1 className="movie-detail-title">{movie.title}</h1>

            {movie.director && (
              <p className="movie-detail-director">
                Directed by <span className="glow-text">{movie.director}</span>
              </p>
            )}

            {rating > 0 && (
              <div className="movie-detail-rating">
                <div className="rating-circle">
                  <span className="rating-value">{rating.toFixed(1)}</span>
                  <Star size={16} fill="currentColor" className="star" style={{ color: 'var(--gold)' }} />
                </div>
                <div className="rating-bar-bg">
                  <div className="rating-bar-fill" style={{ width: `${(rating / 10) * 100}%` }}></div>
                </div>
              </div>
            )}

            {movie.cast && (
              <div className="movie-detail-cast">
                <h4><Tag size={14} /> Cast</h4>
                <p>{movie.cast}</p>
              </div>
            )}

            {movie.description && (
              <div className="movie-detail-synopsis">
                <h4>Synopsis</h4>
                <p>{movie.description}</p>
              </div>
            )}

            {movie.trailerUrl && (
              <a href={movie.trailerUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                <ExternalLink size={16} /> Watch Trailer
              </a>
            )}
          </motion.div>
        </div>

        {/* Related Blog Posts */}
        {relatedBlogs.length > 0 && (
          <section className="section" style={{ paddingBottom: 0 }}>
            <div className="section-header" style={{ textAlign: 'left' }}>
              <span className="section-label">Related</span>
              <h2>Blog Posts about this Movie</h2>
            </div>
            <div className="blog-grid">
              {relatedBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
