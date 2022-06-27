const generateRandomString = require("./functions")
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

generateRandomString();

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
// GET ROUTES //

app.get("/urls", (req, res) => {
 const templateVars = { urls: urlDatabase };
 res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
 res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
 const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
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


app.listen(PORT, () => {
 console.log(`Example app listening on port ${PORT}`);
});

