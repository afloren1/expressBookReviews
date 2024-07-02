const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user) => {
      return user.username === username;
    });
    return userswithsamename.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
});
if (validusers.length > 0) {
    return true;
} else {
    return false;
}
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User " + req.body.username + " successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    };
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const arrayOfbooks = Object.keys(books).map(isbn => books[isbn]);
    const isbn = req.params.isbn;
    let filter_isbn = arrayOfbooks.filter((books) => books.isbn === isbn);
    
    if (filter_isbn.length > 0) {
        // Select the first matching book and update reviews if provided
        let filter_isbn = filter_isbn[0];
        
        
        // Replace old review entry with updated review
        isbn = arrayOfbooks.filter((books) => books.isbn != isbn);
        books.push({ "review": review});
        
        // Send success message indicating the review has been added
        res.send(`User ` + req.body.username + ` added review.`);
    } else {
        // Send error message if no book found
        res.send("Unable to find book!");
    }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
