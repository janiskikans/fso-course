import { useState, useEffect, useRef } from 'react'
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
  const newBlogFormRef = useRef()

  const sortBlogsByLikes = (blogsToSort) => {
    return blogsToSort.sort((blogA, blogB) => blogB.likes - blogA.likes)
  }

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(sortBlogsByLikes(blogs))
    })
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

  const createNewBlog = async (blogData) => {
    try {
      const newBlog = await blogService.createBlog(blogData)
      setBlogs(sortBlogsByLikes(blogs.concat(newBlog)))
      newBlogFormRef.current.toggleVisibility()
      showNotification(`a new blog "${newBlog.title}" by ${newBlog.author} added`)
    } catch (error) {
      showNotification(error.response.data.error ?? 'Something went wrong', 'error')
    }
  }

  const likeBlog = async (blogToUpdate) => {
    try {
      const updatedBlog = await blogService.updateBlog({
        id: blogToUpdate.id,
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        likes: blogToUpdate.likes + 1,
        url: blogToUpdate.url,
        user: blogToUpdate.user?.id,
      })

      setBlogs(sortBlogsByLikes(blogs.map(blog => blog.id !== blogToUpdate.id ? blog : updatedBlog)))
      showNotification(`liked blog "${updatedBlog.title}" by ${updatedBlog.author}`)
    } catch (error) {
      showNotification(error.response.data.error ?? 'Something went wrong', 'error')
    }
  }

  const deleteBlog = async (blogToDelete) => {
    try {
      await blogService.deleteBlog(blogToDelete.id)

      setBlogs(sortBlogsByLikes(blogs.filter(blog => blog.id !== blogToDelete.id)))
      showNotification(`blog "${blogToDelete.title}" by ${blogToDelete.author} deleted`)
    } catch (error) {
      showNotification(error.response.data.error ?? 'Something went wrong', 'error')
    }
  }

  return (
    <div>
      <Notification notification={notification} />
      <h2>blogs</h2>
      <div style={authInfoBlockStyle}>
        <p>{user.name} logged in</p>
        <button style={logoutButtonStyle} onClick={handleLogout}>logout</button>
      </div>
      <Toggleable showButtonLabel='create new blog' hideButtonLabel='cancel' ref={newBlogFormRef}>
        <CreateBlogForm createBlog={createNewBlog} />
      </Toggleable>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={likeBlog}
          deleteBlog={deleteBlog}
          showDelete={user.username === blog.user?.username}
        />
      )}
    </div>
  )
}

export default App