const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User " + req.body.username + " has been added." });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    res.send(JSON.stringify(books,null,3));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const arrayOfbooks = Object.keys(books).map(isbn => books[isbn]);
  const isbn = req.params.isbn;
  let filter_isbn = arrayOfbooks.filter((book) => book.isbn === isbn);
   res.send(filter_isbn);
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const arrayOfbooks = Object.keys(books).map(author => books[author]);
  const author = req.params.author;
  let filter_author = arrayOfbooks.filter((book) => book.author === author);
   res.send(filter_author);
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const arrayOfbooks = Object.keys(books).map(title => books[title]);
  const title = req.params.title;
  let filter_title = arrayOfbooks.filter((book) => book.title === title);
   res.send(filter_title);
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let foundBook = null;
  console.log(`Requested ISBN: ${isbn}`); // Log the requested ISBN
  // Loop through the books to find the one with the matching ISBN
  for (let key in books) {
    const bookIsbn = books[key].isbn;
    console.log(`Checking book ISBN: ${bookIsbn}`); // Log each ISBN being checked
    if (bookIsbn === isbn) {
      foundBook = books[key];
      break;
    }
  }
  // If the book is found and it has reviews
  if (foundBook && foundBook.reviews) {
    res.send(foundBook.reviews);
  } else {
    res.status(404).send({ message: "No reviews found for this ISBN" });
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
