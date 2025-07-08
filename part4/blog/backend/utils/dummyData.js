const bcrypt = require('bcrypt')
const User = require('../model/user')
const Blog = require('../model/blog')

const dummyUsers = [
    {
        username: 'johndoe',
        name: 'John Doe',
        password: 'password123'
    },
    {
        username: 'janesmth',
        name: 'Jane Smith',
        password: 'password123'
    },
    {
        username: 'bobwils',
        name: 'Bob Wilson',
        password: 'password123'
    },
    {
        username: 'alicejns',
        name: 'Alice Johnson',
        password: 'password123'
    },
    {
        username: 'mikebrown',
        name: 'Mike Brown',
        password: 'password123'
    }
]

const dummyBlogs = [
    {
        title: 'Introduction to React',
        author: 'John Doe',
        url: 'https://reactjs.org/tutorial/tutorial.html',
        likes: 25
    },
    {
        title: 'Understanding Node.js',
        author: 'Jane Smith',
        url: 'https://nodejs.org/en/about/',
        likes: 18
    },
    {
        title: 'MongoDB Best Practices',
        author: 'Bob Wilson',
        url: 'https://docs.mongodb.com/manual/',
        likes: 32
    },
    {
        title: 'Express.js Fundamentals',
        author: 'Alice Johnson',
        url: 'https://expressjs.com/en/starter/installing.html',
        likes: 14
    },
    {
        title: 'JavaScript ES6 Features',
        author: 'Mike Brown',
        url: 'https://es6-features.org/',
        likes: 41
    },
    {
        title: 'CSS Grid Layout Guide',
        author: 'John Doe',
        url: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
        likes: 28
    },
    {
        title: 'REST API Design',
        author: 'Jane Smith',
        url: 'https://restfulapi.net/',
        likes: 35
    },
    {
        title: 'Git Version Control',
        author: 'Bob Wilson',
        url: 'https://git-scm.com/book',
        likes: 22
    },
    {
        title: 'Testing with Jest',
        author: 'Alice Johnson',
        url: 'https://jestjs.io/docs/getting-started',
        likes: 19
    },
    {
        title: 'Docker for Developers',
        author: 'Mike Brown',
        url: 'https://docs.docker.com/get-started/',
        likes: 37
    },
    {
        title: 'TypeScript Basics',
        author: 'John Doe',
        url: 'https://www.typescriptlang.org/docs/',
        likes: 29
    },
    {
        title: 'GraphQL Introduction',
        author: 'Jane Smith',
        url: 'https://graphql.org/learn/',
        likes: 16
    },
    {
        title: 'Redux State Management',
        author: 'Bob Wilson',
        url: 'https://redux.js.org/introduction/getting-started',
        likes: 31
    },
    {
        title: 'Webpack Configuration',
        author: 'Alice Johnson',
        url: 'https://webpack.js.org/concepts/',
        likes: 12
    },
    {
        title: 'AWS Cloud Services',
        author: 'Mike Brown',
        url: 'https://aws.amazon.com/getting-started/',
        likes: 45
    }
]

const insertDummyData = async () => {
    try {
        await User.deleteMany({})
        await Blog.deleteMany({})

        const saltRounds = 10
        const createdUsers = []

        for (const userData of dummyUsers) {
            const passwordHash = await bcrypt.hash(userData.password, saltRounds)
            const user = new User({
                username: userData.username,
                name: userData.name,
                passwordHash
            })
            const savedUser = await user.save()
            createdUsers.push(savedUser)
        }

        const createdBlogs = []

        for (let i = 0; i < dummyBlogs.length; i++) {
            const blogData = dummyBlogs[i]
            const userIndex = i % createdUsers.length
            const user = createdUsers[userIndex]

            const blog = new Blog({
                title: blogData.title,
                author: blogData.author,
                url: blogData.url,
                likes: blogData.likes,
                user: user._id
            })

            const savedBlog = await blog.save()
            createdBlogs.push(savedBlog)

            user.blogs = user.blogs.concat(savedBlog._id)
            await user.save()
        }

        console.log(`Successfully inserted ${createdUsers.length} users and ${createdBlogs.length} blogs`)
        
        return {
            users: createdUsers,
            blogs: createdBlogs
        }

    } catch (error) {
        console.error('Error inserting dummy data:', error)
        throw error
    }
}

module.exports = {
    insertDummyData,
    dummyUsers,
    dummyBlogs
}