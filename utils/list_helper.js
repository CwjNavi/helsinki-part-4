const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0) // 0 is the initial value of sum
}

const favouriteBlog = (blogs) => {
    return blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog)
}

const mostBlogs = (blogs) => {
    // return the author with the most blogs and the number of blogs
    // return { author: "author", blogs: 3 }
    blogMap = new Map()
    maxCount = 0
    maxAuthor = ""
    blogs.forEach(blog => {
        if (blogMap.has(blog.author)) {
            blogMap.set(blog.author, blogMap.get(blog.author) + 1)
        } else {
            blogMap.set(blog.author, 1)
        }

        if (blogMap.get(blog.author) > maxCount) {
            maxCount = blogMap.get(blog.author)
            maxAuthor = blog.author
        }
    })
    
    return { author: maxAuthor, count: maxCount }
}

const mostLikes = (blogs) => {
    blogMap = new Map()
    maxLikes = 0
    maxAuthor = ''
    blogs.forEach(blog => {
        if (blogMap.has(blog.author)) {
            blogMap.set(blog.author, blogMap.get(blog.author) + blog.likes)
        } else {
            blogMap.set(blog.author, blog.likes)
        }

        if (blogMap.get(blog.author) > maxLikes) {
            maxLikes = blogMap.get(blog.author)
            maxAuthor = blog.author
        }
    })
    return {author: maxAuthor, likes: maxLikes}
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}