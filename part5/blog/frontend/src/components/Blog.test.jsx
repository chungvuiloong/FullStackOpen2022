import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog component', () => {
  const blog = {
    id: 1,
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: { name: 'testuser' }
  }

  const mockUser = { name: 'testuser' }
  const mockUpdateBlog = vi.fn()
  const mockDeleteBlog = vi.fn()

  test('renders title and author but not URL or likes by default', () => {
    render(
      <Blog
        blog={blog}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
        user={mockUser}
      />
    )

    const titleElement = screen.getByText('Component testing is done with react-testing-library', { exact: false })
    const authorElement = screen.getByText('Test Author', { exact: false })
    
    expect(titleElement).toBeInTheDocument()
    expect(authorElement).toBeInTheDocument()

    const urlElement = screen.queryByText('http://test.com')
    const likesElement = screen.queryByText('likes 5')
    
    expect(urlElement).not.toBeInTheDocument()
    expect(likesElement).not.toBeInTheDocument()
  })

  test('shows URL and likes when view button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <Blog
        blog={blog}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
        user={mockUser}
      />
    )

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const urlElement = screen.getByText('http://test.com')
    const likesElement = screen.getByText('likes 5', { exact: false })
    
    expect(urlElement).toBeInTheDocument()
    expect(likesElement).toBeInTheDocument()
  })

  test('calls event handler twice when like button is clicked twice', async () => {
    const user = userEvent.setup()

    render(
      <Blog
        blog={blog}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
        user={mockUser}
      />
    )

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockUpdateBlog).toHaveBeenCalledTimes(2)
  })
})