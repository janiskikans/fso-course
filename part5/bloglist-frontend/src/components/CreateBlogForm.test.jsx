import CreateBlogForm from './CreateBlogForm'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('<CreateBlogForm />', () => {
  test('createBlog handler is called with blog details when form is submitted', async () => {
    const createBlogHandler = vi.fn()

    const { container } = render(<CreateBlogForm createBlog={createBlogHandler} />)

    const submitButton = screen.getByText('create')
    const titleInput = container.querySelector('#title')
    const authorInput = container.querySelector('#author')
    const urlInput = container.querySelector('#url')
    const user = userEvent.setup()

    await user.type(titleInput, 'A new blog title')
    await user.type(authorInput, 'A new blog author')
    await user.type(urlInput, 'http://www.newblog.test')

    await user.click(submitButton)

    expect(createBlogHandler.mock.calls).toHaveLength(1)
    expect(createBlogHandler.mock.calls[0][0]).toStrictEqual({
      title: 'A new blog title',
      author: 'A new blog author',
      url: 'http://www.newblog.test',
    })
  })
})