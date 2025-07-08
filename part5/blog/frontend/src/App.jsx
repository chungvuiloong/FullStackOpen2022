import { useState, useEffect } from 'react'
import Blog from './components/Blog'

const App = () => {
    const [blogs, setBlogs] = useState([
        { id: 1, title: 'Example Blog 1', author: 'Author 1' },
        { id: 2, title: 'Example Blog 2', author: 'Author 2' }
    ])
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()
        if (username && password) {
            const user = { name: username }
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
            setUser(user)
            setUsername('')
            setPassword('')
        } else {
            console.log('Wrong credentials')
        }
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
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
            </div>
            {user && (
                <p>
                    {user.name} logged-in 
                    <button onClick={handleLogout}>logout</button>
                </p>
            )}
            <h2>blogs</h2>
            {user && blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
            )}
        </div>
    )
}

export default App
