const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
]

const getDbBlogs = async () => {
  const blogs = await Blog.find({})

  return blogs.map(blog => blog.toJSON())
}

const deleteAllBlogs = async () => {
  await Blog.deleteMany({})
}

const getNonExistingId = async () => {
  const blog = new Blog({
    title: 'Non-existing Blog',
    author: 'John Doe',
    url: 'https://nonexistingblogsite.com/',
    likes: 0
  })

  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

module.exports = { initialBlogs, getDbBlogs, deleteAllBlogs, getNonExistingId }