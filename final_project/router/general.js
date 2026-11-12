const express = require('express');
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Check whether username and password are provided
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }
  
    // Check whether the username already exists
    if (isValid(username)) {
      return res.status(409).json({
        message: "User already exists!"
      });
    }
  
    // Register the new user
    users.push({
      username: username,
      password: password
    });
  
    return res.status(201).json({
      message: "User successfully registered. Now you can login"
    });
  });

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    const matchingBooks = [];
  
    for (const isbn of bookKeys) {
      if (books[isbn].author === author) {
        matchingBooks.push(books[isbn]);
      }
    }
  
    res.send(JSON.stringify(matchingBooks, null, 4));
  });
  
// Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    const matchingBooks = [];
  
    for (const isbn of bookKeys) {
      if (books[isbn].title === title) {
        matchingBooks.push(books[isbn]);
      }
    }
  
    res.send(JSON.stringify(matchingBooks, null, 4));
  });

// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.send(JSON.stringify(books[isbn].reviews, null, 4));
  }

  return res.status(404).json({message: "Book not found"});
});

// Task 10: Get all books using async/await and Axios
const getAllBooksAsync = async () => {
    try {
      const response = await axios.get("http://localhost:5000/");
      console.log("Task 10 - All books:", response.data);
      return response.data;
    } catch (error) {
      console.error("Task 10 - Error retrieving books:", error.message);
      throw error;
    }
  };

  // Task 11: Get book details by ISBN using async/await and Axios
const getBookByISBNAsync = async (isbn) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/isbn/${isbn}`
      );
  
      console.log("Task 11 - Book details:", response.data);
  
      return response.data;
    } catch (error) {
      console.error(
        "Task 11 - Error retrieving book:",
        error.message
      );
  
      throw error;
    }
  };

  // Task 12: Get books by author using async/await and Axios
const getBooksByAuthorAsync = async (author) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/author/${encodeURIComponent(author)}`
      );
  
      console.log("Task 12 - Books by author:", response.data);
  
      return response.data;
    } catch (error) {
      console.error(
        "Task 12 - Error retrieving books by author:",
        error.message
      );
  
      throw error;
    }
  };

  // Task 13: Get books by title using async/await and Axios
const getBooksByTitleAsync = async (title) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/title/${encodeURIComponent(title)}`
      );
  
      console.log("Task 13 - Books by title:", response.data);
  
      return response.data;
    } catch (error) {
      console.error(
        "Task 13 - Error retrieving books by title:",
        error.message
      );
  
      throw error;
    }
  };

module.exports.general = public_users;
