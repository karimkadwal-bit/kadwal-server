const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let products = [];

let users = [];

app.get("/", (req, res) => {
  res.send("Kadwal Marketplace Server Running");
});

app.get("/products", (req, res) => {
  res.json(products);
});

app.post("/products", (req, res) => {

  const product = req.body;

  products.push(product);

  res.json({
    message: "Product Added"
  });

});

app.delete("/products/:index", (req, res) => {

  const index = req.params.index;

  products.splice(index, 1);

  res.json({
    message: "Product Deleted"
  });

});

app.post("/signup", (req, res) => {

  const user = req.body;

  users.push(user);

  res.json({
    message: "Signup Successful"
  });

});

app.post("/login", (req, res) => {

  const { username, password } = req.body;

  const user = users.find(
    u =>
      u.username === username &&
      u.password === password
  );

  if(user){

    res.json({
      message: "Login Successful"
    });

  } else {

    res.json({
      message: "Invalid Credentials"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log("Server running on port " + PORT);

});
