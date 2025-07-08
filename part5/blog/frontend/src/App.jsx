import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
    }
  }, [user])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('Wrong credentials')
    }
  }

  return (
    <div>
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin} aria-label="login form">
          <div>
            <label htmlFor="username">Username</label>
            <input 
              id="username" 
              name="username" 
              type="text" 
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              autoComplete="username" 
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              autoComplete="current-password" 
            />
          </div>
          <button type="submit">Login</button>
        </form>
        {user && <p>{user.name} logged-in</p>}
      </div>
      
      <div>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </div>
  )
}

export default App