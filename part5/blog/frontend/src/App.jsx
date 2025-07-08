import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'

const App = () => {
    const [blogs, setBlogs] = useState([
        { id: 1, title: 'Example Blog 1', author: 'Author 1' },
        { id: 2, title: 'Example Blog 2', author: 'Author 2' }
    ])
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    const [message, setMessage] = useState(null)

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
            setMessage('Wrong username or password')
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
    }

    const addBlog = (event) => {
        event.preventDefault()
        const newBlog = {
            id: blogs.length + 1,
            title,
            author,
            url
        }
        setBlogs(blogs.concat(newBlog))
        setTitle('')
        setAuthor('')
        setUrl('')
        setMessage(`A new blog "${title}" by ${author} added`)
        setTimeout(() => {
            setMessage(null)
        }, 3000)
    }

    return (
        <div>
            <Notification message={message} />
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
                <div>
                    <p>
                        {user.name} logged-in 
                        <button onClick={handleLogout}>logout</button>
                    </p>
                    
                    <h3>create new</h3>
                    <form onSubmit={addBlog}>
                        <div>
                            title:
                            <input
                                type="text"
                                value={title}
                                onChange={({ target }) => setTitle(target.value)}
                            />
                        </div>
                        <div>
                            author:
                            <input
                                type="text"
                                value={author}
                                onChange={({ target }) => setAuthor(target.value)}
                            />
                        </div>
                        <div>
                            url:
                            <input
                                type="text"
                                value={url}
                                onChange={({ target }) => setUrl(target.value)}
                            />
                        </div>
                        <button type="submit">create</button>
                    </form>
                </div>
            )}
            <h2>blogs</h2>
            {user && blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
            )}
        </div>
    )
}

export default App
