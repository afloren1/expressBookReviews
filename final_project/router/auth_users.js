const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
    "username": "user1",
    "password": "pass1"
}
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user) => {
    return user.username === username;
});
// Return true if any user with the same username is found, otherwise false
if (userswithsamename.length > 0) {
    return true;
} else {
    return false;
}
};

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}
//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: username
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken
        };
        req.session.username = username;
        return res.status(200).send("User " + req.body.username + " successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn; // Get the ISBN from the URL parameter
  const review = req.query.review;
  const username = req.session.username; // Get the username from the session
  if (!username) {
    return res.status(401).send('You must be logged in to post a review');
  }

  let foundBook = null;
  for (let key in books) {
    if (books[key].isbn === isbn) {
      foundBook = books[key];
    }
  }
  if (foundBook) {
    // Initialize reviews if not already present
    if (!foundBook.reviews) {
      foundBook.reviews = {};
    }

    // Add or update the review
    foundBook.reviews[username] = review;

    res.send(`User ${username} added/updated their review.`);
  } else {
    res.status(404).send("Unable to find book!");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Get the ISBN from the URL parameter
    const review = req.query.review;
    const username = req.session.username; // Get the username from the session
      
    let foundBook = null;
    for (let key in books) {
      if (books[key].isbn === isbn) {
        foundBook = books[key];
      }
    }
    if (foundBook) {
      // Initialize reviews if not already present
      if (foundBook.reviews && foundBook.reviews[username]) {
        // Delete the user's review
        delete foundBook.reviews[username];
        res.send(`User ${username} deleted their review.`);
    } else {
        res.status(404).send("Review not found for this user.");
    }
} else {
    res.status(404).send("Unable to find book!");
}
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
