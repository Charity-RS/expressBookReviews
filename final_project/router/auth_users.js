const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Check whether credentials are provided
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }
  
    // Validate the username and password
    const validUser = users.some(
      (user) => user.username === username && user.password === password
    );
  
    if (!validUser) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }
  
    // Generate a JWT
    const accessToken = jwt.sign(
      { username: username },
      "access",
      { expiresIn: "1h" }
    );
  
    // Store the JWT in the session
    req.session.authorization = {
      accessToken: accessToken,
      username: username
    };
  
    return res.status(200).json({
      message: "User successfully logged in"
    });
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization?.username;
  
    // Verify that the user is logged in
    if (!username) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }
    
  // Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;
  
    if (!username) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({
        message: "Book not found"
      });
    }
  
    if (!Object.prototype.hasOwnProperty.call(books[isbn].reviews, username)) {
      return res.status(404).json({
        message: "You have not submitted a review for this book"
      });
    }
  
    delete books[isbn].reviews[username];
  
    return res.status(200).json({
      message: "Review deleted successfully",
      reviews: books[isbn].reviews
    });
  });

    // Check whether the book exists
    if (!books[isbn]) {
      return res.status(404).json({
        message: "Book not found"
      });
    }
  
    // Check whether a review was provided
    if (!review) {
      return res.status(400).json({
        message: "Review is required"
      });
    }
  
    // Add or update the review for this user
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews
    });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
