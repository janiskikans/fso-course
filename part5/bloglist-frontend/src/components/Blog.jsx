import { useState } from 'react'

const Blog = ({ blog, likeBlog, deleteBlog, showDelete }) => {
  const [showDetails, setShowDetails] = useState(false)

  const detailsBlockStyle = { display: showDetails ? '' : 'none' }
  const blogTitleStyle = { fontWeight: 'bold' }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'groove',
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 5
  }

  const toggleDetails = () => setShowDetails(!showDetails)
  const handleLikeClick = () => likeBlog(blog)

  const handleRemoveClick = () => {
    if (confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog)
    }
  }

  return (
    <div style={blogStyle}>
      <span style={blogTitleStyle} data-testid='blog-title'>{blog.title} {blog.author}</span>
      <button onClick={toggleDetails}>{ showDetails ? 'hide' : 'view' }</button>
      <div style={detailsBlockStyle} data-testid='blog-details'>
        <div data-testid='blog-details-url'>{blog.url}</div>
        <div data-testid='blog-details-likes'>
          likes {blog.likes}
          <button onClick={handleLikeClick}>like</button>
        </div>
        <div data-testid='blog-details-user-name'>{ blog.user?.name ?? 'unknown' }</div>
        {showDelete && <button onClick={handleRemoveClick}>remove</button>}
      </div>
    </div>
  )
}

export default Blog