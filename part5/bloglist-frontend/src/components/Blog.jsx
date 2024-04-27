import { useState } from "react"

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
      <span style={blogTitleStyle}>{blog.title} {blog.author}</span>
      <button onClick={toggleDetails}>{ showDetails ? 'hide' : 'view' }</button>
      <div style={detailsBlockStyle}>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={handleLikeClick}>like</button>
        </div>
        <div>{ blog.user?.name ?? 'unknown' }</div>
        {showDelete && <button onClick={handleRemoveClick}>remove</button>}
      </div>
    </div>  
  )
}

export default Blog