const req = require("express/lib/request");
const bcrypt = require('bcryptjs');

const generateRandomString = () => {
 const defaultArray = ["", "", "", "", "", ""]
 const newArray = []

for (const position of defaultArray) {

 const character = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "A", "b", "B", "c", "C", "d", "D", "e", "E", "f", "F", "g", "G", "h", "H", "i", "I", "j", "J", "k", "K", "l", "L", "m", "M", "n", "N", "o", "O", "p", "P", "q", "Q", "r", "R", "s", "S", "t", "T", "u", "U", "v", "V", "w", "W", "x", "X", "y", "Y", "z", "Z"];
  const index = Math.floor(Math.random() * character.length)
  newArray.push(character[index]);
}
const randomString = newArray.join("");
return randomString;
}

const emailCheck = (newEmail, database) => {
 for (const user in database) {
  if (newEmail === database[user].email) {
   return true;
  }
 }
 return false;
};

const currentUser = (email, password, database) => {
 for (const userId in database) {
  const user = database[userId];
  console.log("current user from function page", user);
  if (user.email === email && bcrypt.compareSync(password, user.password)) {
   return user;
  }
 }
};

const checkShortUrl = (URL, database) => {
 return database[URL];
};

const urlsForUser = (user, UrlDatabase) => {
 let userUrls = {}
for (const key in UrlDatabase) {
const url = UrlDatabase[key]
 if (url.userID === user.id) {
  userUrls[key] = url;
 }
}
return userUrls;
};

const addNewUser = (newUser, database) => {
 const userId = generateRandomString()
 newUser.id = userId;
 newUser.password = bcrypt.hashSync(newUser.password, 10);
 database[userId] = newUser;
 return newUser;
}




const isIdOwner = (userId, shortURL, database) => !userId ? false : userId === database[shortURL].userID

module.exports = { generateRandomString, emailCheck, currentUser, checkShortUrl, urlsForUser, isIdOwner, addNewUser, };