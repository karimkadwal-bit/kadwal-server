const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const products = [];

// Home
app.get("/", (req, res) => {
  res.send("Kadwal Marketplace API Running");
});

// Signup
app.post("/signup", (req, res) => {

  const { email, password } = req.body;

  console.log("Signup:", email);

  res.send("Signup Successful");

});

// Login
app.post("/login", (req, res) => {

  const { email, password } = req.body;

  console.log("Login:", email);

  res.send("Login Successful");

});

// Add Product
app.post("/add-product", (req, res) => {

  const { productName, productPrice } = req.body;

  products.push({
    productName,
    productPrice
  });

  res.send("Product Added Successfully");

});

// Get Products
app.get("/products", (req, res) => {

  res.json(products);

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
