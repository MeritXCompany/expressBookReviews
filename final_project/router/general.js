const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6 / User Registration
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "Customer already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register customer." });
});

// Task 1 & Task 10: Get the book list available in the shop using Promises / async-await
public_users.get('/', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });

    getBooks
        .then((b) => {
            return res.status(200).send(JSON.stringify(b, null, 4));
        })
        .catch((err) => {
            return res.status(500).json({ message: "Error retrieving books" });
        });
});

// Task 2 & Task 11: Get book details based on ISBN using Promises / async-await
public_users.get('/isbn/:isbn', function (req, res) {
    const getBookByISBN = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ status: 404, message: "Book not found" });
        }
    });

    getBookByISBN
        .then((book) => {
            return res.status(200).json(book);
        })
        .catch((err) => {
            return res.status(err.status || 500).json({ message: err.message });
        });
});

// Task 3 & Task 12: Get book details based on author using Promises / async-await
public_users.get('/author/:author', function (req, res) {
    const getBooksByAuthor = new Promise((resolve, reject) => {
        const author = req.params.author.toLowerCase();
        const bookKeys = Object.keys(books);
        let matchedBooks = [];

        bookKeys.forEach((key) => {
            if (books[key].author.toLowerCase() === author) {
                matchedBooks.push(books[key]);
            }
        });

        if (matchedBooks.length > 0) {
            resolve(matchedBooks);
        } else {
            reject({ status: 404, message: "No books found by this author" });
        }
    });

    getBooksByAuthor
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((err) => {
            return res.status(err.status || 500).json({ message: err.message });
        });
});

// Task 4 & Task 13: Get all books based on title using Promises / async-await
public_users.get('/title/:title', function (req, res) {
    const getBooksByTitle = new Promise((resolve, reject) => {
        const title = req.params.title.toLowerCase();
        const bookKeys = Object.keys(books);
        let matchedBooks = [];

        bookKeys.forEach((key) => {
            if (books[key].title.toLowerCase() === title) {
                matchedBooks.push(books[key]);
            }
        });

        if (matchedBooks.length > 0) {
            resolve(matchedBooks);
        } else {
            reject({ status: 404, message: "No books found with this title" });
        }
    });

    getBooksByTitle
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((err) => {
            return res.status(err.status || 500).json({ message: err.message });
        });
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }
    return res.status(404).json({ message: "Book not found" });
});

// =========================================================================
// Functions demonstrating Axios with async/await and Promises (Tasks 10 - 13)
// =========================================================================

// Task 10: Get all books using Axios and async/await
const getAllBooksAsync = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return response.data;
    } catch (error) {
        console.error("Error in getAllBooksAsync:", error.message);
        throw error;
    }
};

// Task 11: Get book details based on ISBN using Axios and async/await
const getBookByISBNAsync = async (isbn) => {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return response.data;
    } catch (error) {
        console.error(`Error in getBookByISBNAsync for ISBN ${isbn}:`, error.message);
        throw error;
    }
};

// Task 12: Get book details based on Author using Axios and async/await
const getBookByAuthorAsync = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return response.data;
    } catch (error) {
        console.error(`Error in getBookByAuthorAsync for author ${author}:`, error.message);
        throw error;
    }
};

// Task 13: Get book details based on Title using Axios and async/await
const getBookByTitleAsync = async (title) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return response.data;
    } catch (error) {
        console.error(`Error in getBookByTitleAsync for title ${title}:`, error.message);
        throw error;
    }
};

module.exports.general = public_users;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getBookByISBNAsync = getBookByISBNAsync;
module.exports.getBookByAuthorAsync = getBookByAuthorAsync;
module.exports.getBookByTitleAsync = getBookByTitleAsync;
