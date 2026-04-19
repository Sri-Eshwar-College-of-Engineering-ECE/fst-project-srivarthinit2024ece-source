import { Link } from 'react-router-dom';
import { Clock, User, ArrowRight } from 'lucide-react';
import './BlogCard.css';

export default function BlogCard({ blog }) {
  const excerpt = blog.content
    ? blog.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...'
    : '';

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : '';

  return (
    <Link to={`/blog/${blog._id}`} className="blog-card card" id={`blog-${blog._id}`}>
      {blog.coverImage && (
        <div className="blog-card-image">
          <img src={blog.coverImage} alt={blog.title} loading="lazy" />
        </div>
      )}
      <div className="blog-card-body">
        <div className="blog-card-tags">
          {blog.movieTitle && <span className="badge badge-accent">{blog.movieTitle}</span>}
          {blog.category && <span className="badge badge-dark">{blog.category}</span>}
        </div>
        <h3 className="blog-card-title">{blog.title}</h3>
        <p className="blog-card-excerpt">{excerpt}</p>
        <div className="blog-card-footer">
          <div className="blog-card-author">
            <div className="author-avatar">
              <User size={14} />
            </div>
            <span>{blog.authorName || blog.author?.username || 'Anonymous'}</span>
          </div>
          <div className="blog-card-meta-info">
            {formattedDate && (
              <span className="blog-card-date">
                <Clock size={13} /> {formattedDate}
              </span>
            )}
          </div>
        </div>
        <div className="blog-card-read">
          Read More <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}
