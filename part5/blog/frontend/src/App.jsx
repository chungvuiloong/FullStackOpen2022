import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

return (
    <div>
        <form aria-label="login form">
            <div>
                <label htmlFor="username">Username</label>
                <input id="username" name="username" type="text" autoComplete="username" />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" autoComplete="current-password" />
            </div>
            <button type="submit">Login</button>
        </form>
        <h2>blogs</h2>
        {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
        )}
    </div>
)
}

export default App