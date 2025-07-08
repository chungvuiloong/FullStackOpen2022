import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'

const App = () => {
    const [blogs, setBlogs] = useState([
        { 
            id: 1, 
            title: 'Example Blog 1', 
            author: 'Author 1', 
            url: 'http://example1.com',
            likes: 0,
            user: { id: '1', name: 'Test User' }
        },
        { 
            id: 2, 
            title: 'Example Blog 2', 
            author: 'Author 2',
            url: 'http://example2.com',
            likes: 5,
            user: { id: '1', name: 'Test User' }
        }
    ])
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState(null)
    const blogFormRef = useRef()

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

    const addBlog = (blogObject) => {
        const newBlog = {
            id: blogs.length + 1,
            title: blogObject.title,
            author: blogObject.author,
            url: blogObject.url,
            likes: 0,
            user: { id: user.id || '1', name: user.name }
        }
        setBlogs(blogs.concat(newBlog))
        setMessage(`A new blog "${blogObject.title}" by ${blogObject.author} added`)
        setTimeout(() => {
            setMessage(null)
        }, 3000)
        blogFormRef.current.toggleVisibility()
    }

    const updateBlog = async (id, updatedBlog) => {
        try {
            // For now, update locally since we're using mock data
            setBlogs(blogs.map(blog => 
                blog.id !== id ? blog : { ...blog, likes: updatedBlog.likes }
            ))
            // Uncomment when connected to real backend:
            // const returnedBlog = await blogService.update(id, updatedBlog)
            // setBlogs(blogs.map(blog => blog.id !== id ? blog : { ...blog, likes: returnedBlog.likes }))
        } catch (exception) {
            setMessage('Error updating blog')
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }
    }

    return (
        <div>
            <Notification message={message} />
            <div>
                <h2>Log in to application</h2>
                { !user &&
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
                }
            </div>
            {user && (
                <div>
                    <p>
                        {user.name} logged-in 
                        <button onClick={handleLogout}>logout</button>
                    </p>
                    
                    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                        <BlogForm createBlog={addBlog} />
                    </Togglable>
                </div>
            )}
            <h2>blogs</h2>
            {user && blogs
                .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                .map(blog =>
                    <Blog key={blog.id} blog={blog} updateBlog={updateBlog} />
                )}
        </div>
    )
}

export default App
