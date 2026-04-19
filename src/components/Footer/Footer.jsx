import { Link } from 'react-router-dom';
import { Film, Globe, MessageCircle, Heart } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon"><Film size={20} /></div>
              <span className="logo-text">Cine<span className="glow-text">Blog</span></span>
            </Link>
            <p className="footer-tagline">
              Your go-to destination for movie reviews, blog posts, and cinematic discussions.
            </p>
          </div>

          <div className="footer-links-group">
            <h4>Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/blogs">Blog Posts</Link>
            <Link to="/create">Write a Post</Link>
          </div>

          <div className="footer-links-group">
            <h4>Account</h4>
            <Link to="/login">Log In</Link>
            <Link to="/register">Sign Up</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>

          <div className="footer-links-group">
            <h4>Connect</h4>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <Globe size={14} /> GitHub
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <MessageCircle size={14} /> Twitter
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CineBlog. Made with <Heart size={13} className="heart" /> for movie lovers.</p>
        </div>
      </div>
    </footer>
  );
}
