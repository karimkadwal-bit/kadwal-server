const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("Kadwal Marketplace API Running");
});

// Signup Route
app.post("/signup", (req, res) => {

  const { email, password } = req.body;

  console.log("Signup:", email, password);

  res.send("Signup OK");

});

// Login Route
app.post("/login", (req, res) => {

  const { email, password } = req.body;

  console.log("Login:", email, password);

  res.send("Login OK");

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
