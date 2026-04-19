import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Film, Menu, X, LogOut, User, PenSquare, Search } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" id="nav-logo">
          <div className="logo-icon">
            <Film size={22} />
          </div>
          <span className="logo-text">
            Cine<span className="glow-text">Blog</span>
          </span>
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'active' : ''}`}>
          <form className="navbar-search" onSubmit={handleSearch}>
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              id="nav-search"
            />
          </form>

          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} id="nav-home">
            Home
          </Link>
          <Link to="/blogs" className={`nav-link ${location.pathname.startsWith('/blog') ? 'active' : ''}`} id="nav-blogs">
            Blog
          </Link>

          {user ? (
            <div className="nav-user">
              <Link to="/create" className="btn btn-primary btn-sm" id="nav-write">
                <PenSquare size={15} />
                Write
              </Link>
              <Link to="/dashboard" className="nav-avatar" id="nav-dashboard" title="Dashboard">
                <User size={18} />
              </Link>
              <button onClick={handleLogout} className="nav-logout" id="nav-logout" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-ghost btn-sm" id="nav-login">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register">Sign Up</Link>
            </div>
          )}
        </div>

        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          id="nav-mobile-toggle"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
