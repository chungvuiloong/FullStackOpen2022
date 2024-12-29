const { after, test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const supertest = require('supertest')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
    const listWithNoBlog = [

    ]
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]
    const listWithManyBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]
    test('of empty list is zero', () => {
        const result = listHelper.totalLikes(listWithNoBlog)
        assert.strictEqual(result, 0)
    })
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })
    test('of bigger list is calculated right', () => {
        const result = listHelper.totalLikes(listWithManyBlog)
        assert.strictEqual(result, 10)
    })
})

describe('favourite blog', () => {
    const blogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 12,
            __v: 0
        }
    ]

    test('title, author, likes', () => {
        const result = listHelper.favouriteBlog(blogs)
        assert.deepStrictEqual(result, { 
            title: 'Canonical string reduction', 
            author: 'Edsger W. Dijkstra', 
            likes: 12 
        })
        console.log(result);
    })
})

describe('Most blogs', () => {
    const blogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422bb81b54a676234d17f9',
            title: 'Canonical String Reduction',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 12,
            __v: 0
        },
        {
            _id: '5a422cc91b54a676234d17fa',
            title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
            author: 'Robert C. Martin',
            url: 'https://cleancodebook.com/',
            likes: 25,
            __v: 0
        },
        {
            _id: '5a422dd01b54a676234d17fb',
            title: 'The Clean Coder: A Code of Conduct for Professional Programmers',
            author: 'Robert C. Martin',
            url: 'https://thecleancoder.com/',
            likes: 20,
            __v: 0
        },
        {
            _id: '5a422ee21b54a676234d17fc',
            title: 'Test-Driven Development: By Example',
            author: 'Robert C. Martin',
            url: 'https://tddbyexample.com/',
            likes: 15,
            __v: 0
        },
        {
            _id: '5a422ff31b54a676234d17fd',
            title: 'Refactoring: Improving the Design of Existing Code',
            author: 'Martin Fowler',
            url: 'https://refactoring.com/',
            likes: 10,
            __v: 0
        },
        {
            _id: '5a4230a41b54a676234d17fe',
            title: 'Patterns of Enterprise Application Architecture',
            author: 'Martin Fowler',
            url: 'https://martinfowler.com/books/eaa.html',
            likes: 8,
            __v: 0
        },
        {
            _id: '5a4231b51b54a676234d17ff',
            title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
            author: 'Erich Gamma',
            url: 'https://en.wikipedia.org/wiki/Design_Patterns',
            likes: 18,
            __v: 0
        }
    ];
    
    test('Most blogs', () => {
        const result = listHelper.mostBlogs(blogs)
        console.log(result);
        assert.deepStrictEqual(result, { 
            author: "Robert C. Martin",
            blogs: 3
        })
    })
})

describe('Blogs with most likes', () => {
    const blogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422bb81b54a676234d17f9',
            title: 'Canonical String Reduction',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 17,
            __v: 0
        },
        {
            _id: '5a422ee21b54a676234d17fc',
            title: 'Test-Driven Development: By Example',
            author: 'Robert C. Martin',
            url: 'https://tddbyexample.com/',
            likes: 15,
            __v: 0
        },
        {
            _id: '5a422ff31b54a676234d17fd',
            title: 'Refactoring: Improving the Design of Existing Code',
            author: 'Martin Fowler',
            url: 'https://refactoring.com/',
            likes: 10,
            __v: 0
        },
        {
            _id: '5a4230a41b54a676234d17fe',
            title: 'Patterns of Enterprise Application Architecture',
            author: 'Martin Fowler',
            url: 'https://martinfowler.com/books/eaa.html',
            likes: 8,
            __v: 0
        }
    ];
    
    test('Blogs with most likes', () => {
        const result = listHelper.mostLikes(blogs)
        console.log(result);
        assert.deepStrictEqual(result, { 
            author: "Edsger W. Dijkstra",
            likes: 17
        })
    })
})