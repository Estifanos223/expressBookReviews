const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {


    const username = req.body.username;
    const password = req.body.password;
  
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    const allBooks = await getAllBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (e) {
    res.status(500).send(e);
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const targetISBN = parseInt(req.params.isbn);
  const targetBook = await books[targetISBN];
  if (!targetBook) {
    return res.status(404).json({ message: "ISBN not found." });
  } else {
    return res.status(200).json(targetBook);
  }
});
// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  // get array of matching book objects
  const matchingBooks = Object.values(await books).filter(
    (book) => book.author.toLowerCase() === req.params.author.toLowerCase()
  );
  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({ message: "No books by that author." });
  }
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  const matchingTitle = Object.values(await books).filter(
    (book) => book.title.toLowerCase() === req.params.title.toLowerCase()
  )[0];
  if (matchingTitle) {
    return res.status(200).json(matchingTitle);
  } else {
    return res.status(404).json({ message: "Title not found." });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const targetISBN = req.params.isbn;
  const targetBook = books[targetISBN];
  if (targetBook) {
    return res.status(200).send(JSON.stringify(targetBook.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "ISBN not found." });
  }
});

module.exports.general = public_users;
