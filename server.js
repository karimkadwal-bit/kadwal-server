const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://karim:karim455345@cluster0.70ffkmb.mongodb.net/kadwalMarketplace?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.log("MongoDB Error:", err);
});

// Product Schema
const ProductSchema = new mongoose.Schema({
  productName: String,
  productPrice: String
});

const Product = mongoose.model(
  "Product",
  ProductSchema
);

// User Schema
const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model(
  "User",
  UserSchema
);

// Home
app.get("/", (req, res) => {
  res.send("Kadwal Marketplace API Running");
});

// Signup
app.post("/signup", async (req, res) => {

  try {

    const { email, password } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.send("User Already Exists");
    }

    const user = new User({
      email,
      password
    });

    await user.save();

    res.send("Signup Successful");

  } catch (error) {

    console.log(error);
    res.status(500).send("Signup Failed");

  }

});

// Login
app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({
      email,
      password
    });

    if (!user) {
      return res.send("Invalid Email Or Password");
    }

    res.send("Login Successful");

  } catch (error) {

    console.log(error);
    res.status(500).send("Login Failed");

  }

});

// Add Product
app.post("/add-product", async (req, res) => {

  try {

    const { productName, productPrice } = req.body;

    const product = new Product({
      productName,
      productPrice
    });

    await product.save();

    res.send("Product Added Successfully");

  } catch (error) {

    console.log(error);
    res.status(500).send("Failed To Add Product");

  }

});

// Get Products
app.get("/products", async (req, res) => {

  try {

    const products =
      await Product.find();

    res.json(products);

  } catch (error) {

    console.log(error);
    res.status(500).send("Failed To Load Products");

  }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});
