const { generateRandomString, emailCheck, currentUser, checkShortUrl, urlsForUser, isIdOwner, addNewUser } = require("./functions")
const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const app = express();
const bodyParser = require("body-parser");
const PORT = 8080;


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['userId']
}));
app.use(cookieParser())

const usersDatabase = {
 "aJ48lW": {
  id: "aJ48lW",
  email: "user@example.com",
  password: "a"
 },
 "ej4o5j": {
  id: "ej4o5j",
  email: "user2@example.com",
  password: "a"
 }
}

const urlDatabase = {
 b6UTxQ: {
  longURL: "https://www.tsn.ca",
  userID: "aJ48lW"
 },
 i3BoGr: {
  longURL: "https://www.google.ca",
  userID: "ej4o5j"
 }
};
// GET ROUTES //

app.get('/u/:shortURL', (req, res) => {
 let shortURL = req.params.shortURL;
 if (checkShortUrl(shortURL, urlDatabase)) {
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
 } else {
  res.status(404).send('Does not exist');
 }
});

app.get("/login", (req, res) => {
 const userId = req.session.user_id
 const user = usersDatabase[userId]
 const templateVars = { user }
 res.render("login", templateVars)
});

app.get("/urls", (req, res) => {
 const userId = req.session.user_id
 const user = usersDatabase[userId]
 if (!user) {
  res.status(400).send('Please login or register to view URLs');
 } else {
  const usersURLs = urlsForUser(user, urlDatabase);
  const templateVars = { user, urls: usersURLs };
  res.render("urls_index", templateVars);
 }
});

app.get("/urls/new", (req, res) => {
 const userId = req.session.user_id
 const user = usersDatabase[userId]
 const templateVars = { user }
 if (!userId) {
  res.redirect("/login");
 } else {
  res.render("urls_new", templateVars);
 }
 console.log(urlDatabase);
 console.log(usersDatabase);
});

app.get("/urls/:shortURL/edit", (req, res) => {
 const userId = req.session.user_id;
 const user = usersDatabase[userId];
 const shortURL = req.params.shortURL;
 const longURL = urlDatabase[shortURL].longURL
 const templateVars = { user, shortURL, longURL }
 res.render("urls_show", templateVars)
})

app.get("/register", (req, res) => {
 const templateVars = { user: null, }
 res.render("urls_registration", templateVars)
})

app.get("/urls/:shortURL", (req, res) => {
 const shortURL = req.params.shortURL
 const userId = req.session.user_id
 const user = usersDatabase[userId]
if(!user) {
 res.send("no access")
}
if (checkShortUrl(shortURL, urlDatabase)) {
 console.log(user);
 console.log("HERE  ",  urlDatabase[shortURL].userID)
 if (user.id !== urlDatabase[shortURL].userID) {
  res.send("no access")
 } else {
  const longURL = urlDatabase[shortURL].longURL
  const templateVars = { user, shortURL, longURL };
  res.render("urls_show", templateVars)
 }
} else {
 res.send('URL DOESNT EXIST')
}
});


// POST ROUTES //
app.post("/urls", (req, res) => {
 const shortURL = generateRandomString()
 const userID = req.session.user_id;
 const longURL = req.body.longURL;
 urlDatabase[shortURL] = { userID, longURL };
 res.redirect(`/urls`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
 const userId = req.session.user_id;
 const shortURL = req.params.shortURL
 if (!isIdOwner(userId, shortURL, urlDatabase)) {
  res.send('You do not have permission to delete');
 } else {
 delete urlDatabase[shortURL];
 res.redirect('/urls');
 }
})

app.post("/urls/:shortURL/edit", (req, res) => {
 console.log("hello");
 const userID = req.session.user_id;
 const shortURL = req.params.shortURL
 const longURL = req.body.longURL
 if (!isIdOwner(userID, shortURL, urlDatabase)) {
  res.send('You do not have permission to edit');
 } else {
  urlDatabase[shortURL] = { userID, longURL }
 res.redirect(`/urls`);
 }
})

app.post("/login", (req, res) => {
 const { email, password } = req.body;
 const user = currentUser(email, password, usersDatabase);
 if (!user) {
  res.status(403).send('user not found');
 }
 if (user) {
  req.session.user_id = user.id
  res.redirect("/urls");
 }
});

app.post("/logout", (req, res) => {
 req.session = null
 //res.clearCookie("user_id");
 res.redirect("/login");
});

app.post("/register", (req, res) => {
 const { email, password } = req.body;
 console.log("THIS ", req.body);
 if (email === '' || password === '') {
  res.status(400).send('Both email and password are required');
 } else if (emailCheck(email, usersDatabase)) {
  res.status(400).send('user email already in use');
 } else {
  const newUser = addNewUser(req.body, usersDatabase);
  req.session.user_id = newUser.id;
  console.log("NEW USER-------: ", newUser);
  res.redirect('/urls');
 }
})

app.listen(PORT, () => {
 console.log(`Example app listening on port ${PORT}`);
});

