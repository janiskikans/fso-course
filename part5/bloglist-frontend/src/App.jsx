import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import CreateBlogForm from './components/CreateBlogForm'
import Toggleable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: '', type: 'success' })

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const authUser = window.localStorage.getItem('authUser')
    if (authUser) {
      const user = JSON.parse(authUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: '', type: 'success' }), 5000)
  }

  const cleanAuthFields = () => {
    setUsername('')
    setPassword('')
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login(username, password)

      blogService.setToken(user.token)
      window.localStorage.setItem('authUser', JSON.stringify(user))
      setUser(user)
      cleanAuthFields()
    } catch (error) {
      showNotification('Invalid username or password', 'error')
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('authUser')
    setUser(null)
    blogService.setToken()
  }

  const createNewBlog = async (blogData) => {
    try {
      const newBlog = await blogService.createBlog(blogData)
      setBlogs(blogs.concat(newBlog))
      showNotification(`a new blog "${newBlog.title}" by ${newBlog.author} added`)
    } catch (error) {
      showNotification(error.response.data.error ?? 'Something went wrong', 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification notification={notification} />
        <h2>log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">username</label>
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">password</label>
            <input
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    )
  }

  const authInfoBlockStyle = {
    display: 'flex',
    alignItems: 'center'
  }

  const logoutButtonStyle = {
    height: 'fit-content'
  }

  return (
    <div>
      <Notification notification={notification} />
      <h2>blogs</h2>
      <div style={authInfoBlockStyle}>
        <p>{user.name} logged in</p>
        <button style={logoutButtonStyle} onClick={handleLogout}>logout</button>
      </div>
      <Toggleable showButtonLabel='new blog' hideButtonLabel='cancel'>
        <CreateBlogForm createBlog={createNewBlog} />
      </Toggleable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App