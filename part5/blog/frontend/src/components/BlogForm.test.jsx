import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('BlogForm component', () => {
  test('calls event handler with correct details when new blog is created', async () => {
    const user = userEvent.setup()
    const mockCreateBlog = vi.fn()

    render(<BlogForm createBlog={mockCreateBlog} />)

    const titleInput = screen.getByRole('textbox', { name: /title/i })
    const authorInput = screen.getByRole('textbox', { name: /author/i })
    const urlInput = screen.getByRole('textbox', { name: /url/i })
    const createButton = screen.getByText('create')

    await user.type(titleInput, 'Testing React applications')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'http://testurl.com')
    await user.click(createButton)

    expect(mockCreateBlog).toHaveBeenCalledTimes(1)
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'Testing React applications',
      author: 'Test Author',
      url: 'http://testurl.com'
    })
  })
})