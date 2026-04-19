import { Link } from 'react-router-dom';
import { Star, Calendar } from 'lucide-react';
import './MovieCard.css';

export default function MovieCard({ movie }) {
  const rating = movie.rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <Link to={`/movie/${movie._id}`} className="movie-card" id={`movie-${movie._id}`}>
      <div className="movie-card-poster">
        <img
          src={movie.posterUrl || `https://placehold.co/300x450/1a1a2e/e53e3e?text=${encodeURIComponent(movie.title)}`}
          alt={movie.title}
          loading="lazy"
        />
        <div className="movie-card-overlay">
          <span className="movie-card-view">View Details</span>
        </div>
        {movie.rating && (
          <div className="movie-card-rating">
            <Star size={12} fill="currentColor" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.title}</h3>
        <div className="movie-card-meta">
          {movie.genre && <span className="badge badge-dark">{movie.genre}</span>}
          {movie.year && (
            <span className="movie-card-year">
              <Calendar size={12} /> {movie.year}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
