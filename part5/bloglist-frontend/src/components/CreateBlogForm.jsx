import { useState } from "react"

const CreateBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const clearForm = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    clearForm()
  }

  return (
    <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">title</label>
          <input
            id="title"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">author</label>
          <input
            id="author"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <label htmlFor="url">url</label>
          <input
            id="url"
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
  )
}

export default CreateBlogForm