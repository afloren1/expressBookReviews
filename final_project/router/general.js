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
    // Using the async function with a callback
    function fetchbooks () {
        res.send(Object.entries(books));
        console.log('Success');
    }
        setTimeout(fetchbooks, 3000);
        console.log('Obtaining list of books');
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const arrayOfbooks = Object.keys(books).map(isbn => books[isbn]);
    const isbn = req.params.isbn;
    let filter_isbn = arrayOfbooks.filter((book) => book.isbn === isbn);
    let myPromise = new Promise((resolve,reject) => {
       if (filter_isbn) {
          resolve(filter_isbn);
       } else {
          reject(`Book with ISBN ${isbn} not found`);
       }
       });
  console.log("Before calling promise"); //Console log before calling the promise
  myPromise.then(() => {
      console.log("Promise resolved")//Call the promise and wait for it to be resolved and then print a message.
      return res.status(200).json(filter_isbn)});
  myPromise.catch((error) => {
      console.log("Promise Rejected"); //Console log after calling the promise
    return res.status(500).json({message: "An error occurred", error: error});
    });
    console.log("After calling promise"); //Console log after calling the promise
   });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const arrayOfbooks = Object.keys(books).map(author => books[author]);
  const author = req.params.author;
  let filter_author = arrayOfbooks.filter((book) => book.author === author);
  let myPromise = new Promise((resolve,reject) => {
    if (filter_author) {
       resolve(filter_author);
    } else {
       reject(`Book with author ${author} not found`);
    }
    });
console.log("Before calling promise"); //Console log before calling the promise
myPromise.then(() => {
   console.log("Promise resolved")//Call the promise and wait for it to be resolved and then print a message.
   return res.status(200).json(filter_author)});
myPromise.catch((error) => {
   console.log("Promise Rejected"); //Console log after calling the promise
 return res.status(500).json({message: "An error occurred", error: error});
 });
 console.log("After calling promise"); //Console log after calling the promise
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const arrayOfbooks = Object.keys(books).map(title => books[title]);
  const title = req.params.title;
  let filter_title = arrayOfbooks.filter((book) => book.title === title);
  let myPromise = new Promise((resolve,reject) => {
    if (filter_title) {
       resolve(filter_title);
    } else {
       reject(`Book with title ${title} not found`);
    }
    });
console.log("Before calling promise"); //Console log before calling the promise
myPromise.then(() => {
   console.log("Promise resolved")//Call the promise and wait for it to be resolved and then print a message.
   return res.status(200).json(filter_title)});
myPromise.catch((error) => {
   console.log("Promise Rejected"); //Console log after calling the promise
 return res.status(500).json({message: "An error occurred", error: error});
 });
 console.log("After calling promise"); //Console log after calling the promise
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let foundBook = null;
  // Loop through the books to find the one with the matching ISBN
  for (let key in books) {
    const bookIsbn = books[key].isbn;
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
