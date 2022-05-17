const express = require("express");

const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Phonebook Backend" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
