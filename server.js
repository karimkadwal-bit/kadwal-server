const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// MongoDB connect
mongoose.connect("mongodb+srv://karim:ZdgHjYsrs0COMMp7@cluster0.70ffkmb.mongodb.net/")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// Model
const Product = mongoose.model("Product", {
  name: String,
  price: Number
});

// routes
app.get("/", (req, res) => {
  res.send("Kadwal Marketplace Server 🚀");
});

app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post("/products", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json({ message: "Saved to DB ✅", product });
});

// server
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
