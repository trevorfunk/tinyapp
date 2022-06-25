function generateRandomString() {
 const defaultArray = ["", "", "", "", "", ""]
 const newArray = []

for (const position of defaultArray) {
 const character = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "A", "b", "B", "c", "C", "d", "D", "e", "E", "f", "F", "g", "G", "h", "H", "i", "I", "j", "J", "k", "K", "l", "L", "m", "M", "n", "N", "o", "O", "p", "P", "q", "Q", "r", "R", "s", "S", "t", "T", "u", "U", "v", "V", "w", "W", "x", "X", "y", "Y", "z", "Z"];

  const index = Math.floor(Math.random() * character.length)
  newArray.push(character[index]);
}
const randomUrl = newArray.join("");
return randomUrl;
}

module.exports = generateRandomString;