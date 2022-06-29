const {generateRandomString, emailCheck, currentUser} = require("./functions")
const express = require("express");
const cookieParser = require("cookie-parser")
const app = express();
const bodyParser = require("body-parser");
const PORT = 8080;


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

const usersDatabase = { 
 "userRandomID": {
   id: "userRandomID", 
   email: "user@example.com", 
   password: "purple-monkey-dinosaur"
 },
"user2RandomID": {
   id: "user2RandomID", 
   email: "user2@example.com", 
   password: "dishwasher-funk"
 }
}

const urlDatabase = {
 b6UTxQ: {
       longURL: "https://www.tsn.ca",
       userID: "aJ48lW"
   },
   i3BoGr: {
       longURL: "https://www.google.ca",
       userID: "aJ48lW"
   }
};
// GET ROUTES //

app.get("/login", (req, res) => {
 const userId = req.cookies["user_id"]
 const user = usersDatabase[userId]
 const templateVars = {user}
 res.render("login", templateVars)
})

app.get("/urls", (req, res) => {
 const userId = req.cookies["user_id"]
 const user = usersDatabase[userId]
 const templateVars = { 
 user,
 urls: urlDatabase };
 res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
 const userId = req.cookies["user_id"]
 const user = usersDatabase[userId]
 const templateVars = {user}
 if (!userId) {
  res.redirect("/login");
 } else {
res.render("urls_new", templateVars);
 }
});

app.get("/urls/:shortURL/edit", (req, res) => {
 const userId = req.cookies["user_id"];
 const user = usersDatabase[userId];
 const shortURL = req.params.shortURL;
 const longURL = urlDatabase[shortURL].longURL
 const templateVars = {user, shortURL, longURL}
 res.render("urls_show", templateVars)
})

app.get("/register", (req, res) => {
 const templateVars = { user: null, }
 res.render("urls_registration", templateVars)
})

app.get("/urls/:shortURL", (req, res) => {
 const userId = req.cookies["user_id"]
 const user = usersDatabase[userId]
 const shortURL = req.params.shortURL
 const longURL = urlDatabase[shortURL].longURL
 const templateVars = {user, shortURL, longURL};
 res.render("urls_show", templateVars)
});


// POST ROUTES //
app.post("/urls", (req, res) => {
 const shortURL = generateRandomString()
 const userID = req.cookies.user_id
 const longURL = req.body.longURL
 urlDatabase[shortURL] = {userID, longURL}
 res.redirect(`/urls`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
 delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
})

app.post("/urls/:shortURL/edit", (req, res) => {
 const shortURL = req.params.shortURL
 const longURL = req.body.longURL
 const userID = req.cookies.user_id
 urlDatabase[shortURL] = {userID, longURL}
    res.redirect(`/urls`);
})

app.post("/login", (req, res) => {
 const {email, password} = req.body;
 const user = currentUser(email, password, usersDatabase);
 if (!user) {
  res.status(403).send('user not found');
 }
 if (user) {
  res.cookie("user_id", user.id);
  res.redirect("/urls");
 }
 console.log(usersDatabase)
});

app.post("/logout", (req, res) => {
res.clearCookie("user_id");
res.redirect("/login");
});

app.post("/register", (req, res) => {
 const {email, password} = req.body;
 if (email === '' || password === '') {
   res.status(400).send('Both email and password are required');
 } else if (emailCheck(email, usersDatabase)) {
  res.status(400).send('user email already in use');
 } else {
 const userId = generateRandomString()
 const user = { id: userId, ...req.body }
 usersDatabase[userId] = user
 console.log(usersDatabase)
  res.cookie("user_id", userId)
 res.redirect("/urls");
 }
})

app.listen(PORT, () => {
 console.log(`Example app listening on port ${PORT}`);
});

