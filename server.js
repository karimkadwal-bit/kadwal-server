const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Kadwal Marketplace API Running");
});

// signup route
app.post("/signup", (req, res) => {
  console.log(req.body);
  res.send("Signup OK");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
