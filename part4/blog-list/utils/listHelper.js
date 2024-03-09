const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = blogs => {
  if (!blogs.length) {
    return null
  }

  const blogWithMostLikes = blogs.reduce((mostLikedBlog, blog) => {
    return blog.likes > mostLikedBlog.likes ? blog : mostLikedBlog
  }, blogs[0])

  return {
    title: blogWithMostLikes.title,
    author: blogWithMostLikes.author,
    likes: blogWithMostLikes.likes,
  }
}

const mostBlogs = blogs => {
  if (!blogs.length) {
    return null
  }

  const authorBlogs = []

  blogs.forEach(blog => {
    const author = blog.author

    if (authorBlogs[author] === undefined) {
      authorBlogs[author] = 0
    }

    authorBlogs[author]++
  })

  const firstAuthor = Object.keys(authorBlogs)[0]

  const authorWithMostBlogs = Object.keys(authorBlogs).reduce((authorWithHighestCount, currentAuthor) => {
    return authorBlogs[currentAuthor] > authorWithHighestCount.blogs
      ? { author: currentAuthor, blogs: authorBlogs[currentAuthor] }
      : authorWithHighestCount
  }, { author: firstAuthor, blogs: authorBlogs[firstAuthor] })

  return authorWithMostBlogs
}

const mostLikes = blogs => {
  if (!blogs.length) {
    return null
  }

  const authorLikes = []

  blogs.forEach(blog => {
    const author = blog.author

    if (authorLikes[author] === undefined) {
      authorLikes[author] = blog.likes

      return
    }

    authorLikes[author] += blog.likes
  })

  const firstAuthor = Object.keys(authorLikes)[0]

  const authorWithMostLikes = Object.keys(authorLikes).reduce((authorWithHighestCount, currentAuthor) => {
    return authorLikes[currentAuthor] > authorWithHighestCount.likes
      ? { author: currentAuthor, likes: authorLikes[currentAuthor] }
      : authorWithHighestCount
  }, { author: firstAuthor, likes: authorLikes[firstAuthor] })

  return authorWithMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}