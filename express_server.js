const {generateRandomString, emailCheck, currentUser} = require("./functions")
const express = require("express");
const cookieParser = require("cookie-parser")
const app = express();
const bodyParser = require("body-parser");
const PORT = 8080;


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

generateRandomString();

const usersdatabase = { 
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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
// GET ROUTES //

app.get("/login", (req, res) => {
 const userId = req.cookies["user_id"]
 const user = usersdatabase[userId]
 const templateVars = {user}
 res.render("login", templateVars)
})

app.get("/urls", (req, res) => {
 const userId = req.cookies["user_id"]
 const user = usersdatabase[userId]
 const templateVars = { 
 user,
 urls: urlDatabase };
 res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
 const userId = req.cookies["user_id"]
 const user = usersdatabase[userId]
 const templateVars = {user}
res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
 const templateVars = { 
  user: null,
  shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
 res.render("urls_registration", templateVars)
})

app.get("/urls/:shortURL", (req, res) => {
 const userId = req.cookies["user_id"]
 const user = usersdatabase[userId]
 const templateVars = { 
 user,
 shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
 res.render("urls_show", templateVars)
});


// POST ROUTES //
app.post("/urls", (req, res) => {
 const urlId = generateRandomString()
 urlDatabase[urlId] = req.body.longURL
 res.redirect(`/urls/${urlId}`);
 console.log(req);
});

app.post("/urls/:shortURL/delete", (req, res) => {
 delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
    console.log(req);
})

app.post("/urls/:shortURL/edit", (req, res) => {
 const shortURL = req.params.shortURL
    res.redirect(`/urls/${shortURL}`);
})

app.post("/login", (req, res) => {
 const {email, password} = req.body;
 const user = currentUser(email, password, usersdatabase);
 if (!user) {
  res.status(403).send('user not found');
 }
 if (user) {
  res.cookie("user_id", user.id);
  res.redirect("/urls");
 }
 console.log(usersdatabase)
});

app.post("/logout", (req, res) => {
res.clearCookie("user_id");
res.redirect("/login");
});

app.post("/register", (req, res) => {
 const {email, password} = req.body;
 if (email === '' || password === '') {
   res.status(400).send('Both email and password are required');
 } else if (emailCheck(email, usersdatabase)) {
  res.status(400).send('user email already in use');
 } else {
 const userId = generateRandomString()
 const user = { id: userId, ...req.body }
 usersdatabase[userId] = user
 console.log(usersdatabase)
  res.cookie("user_id", userId)
 res.redirect("/urls");
 }
})

app.listen(PORT, () => {
 console.log(`Example app listening on port ${PORT}`);
});

