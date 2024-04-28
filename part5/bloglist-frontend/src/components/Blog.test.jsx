import Blog from './Blog'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  const exampleBlog = {
    id: 'blog-id',
    title: 'Nice blog',
    author: 'Blog Author',
    url: 'https://www.blog.test',
    likes: 5,
    user: {
      name: 'John Doe',
      username: 'johndoe',
    }
  }

  test('renders blog title and author only by default', () => {
    render(<Blog blog={exampleBlog} />)
    
    const blogTitle = screen.getByTestId('blog-title')
    expect(blogTitle).toHaveTextContent('Nice blog Blog Author')

    const blogDetails = screen.getByTestId('blog-details')
    expect(blogDetails).toHaveStyle('display: none;')
  })

  test('renders blog URL and number of likes when "view" button is clicked', async () => {
    render(<Blog blog={exampleBlog} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')

    await user.click(viewButton)

    const blogDetails = screen.getByTestId('blog-details')
    expect(blogDetails).not.toHaveStyle('display: none;')

    const blogDetailsUrl = screen.getByTestId('blog-details-url')
    expect(blogDetailsUrl).toHaveTextContent('https://www.blog.test')

    const blogDetailsLikes = screen.getByTestId('blog-details-likes')
    expect(blogDetailsLikes).toHaveTextContent('likes 5')

    const blogDetailsUser = screen.getByTestId('blog-details-user-name')
    expect(blogDetailsUser).toHaveTextContent('John Doe')
  })

  test('clicking "like" button twice calls handler method twice with blog data', async () => {
    const mockLikeHandler = vi.fn()

    render(<Blog blog={exampleBlog} likeBlog={mockLikeHandler} />)

    const user = userEvent.setup()
    const likeButton = screen.getByText('like')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
    expect(mockLikeHandler.mock.calls[0][0]).toBe(exampleBlog)
    expect(mockLikeHandler.mock.calls[1][0]).toBe(exampleBlog)
  })
})