const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Kadwal Server is Running 🚀");
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});