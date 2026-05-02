const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

// 🔐 MongoDB connection
const uri = "mongodb+srv://karim:ZdgHjYsrs0COMMp7@cluster0.70ffkmb.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

let db;

// connect database
async function connectDB() {
  try {
    await client.connect();
    db = client.db("kadwalDB");
    console.log("MongoDB connected ✅");
  } catch (err) {
    console.error("MongoDB error ❌", err);
  }
}

connectDB();

// test route
app.get('/', (req, res) => {
  res.send("Server is running 🚀");
});

// GET products
app.get('/products', async (req, res) => {
  try {
    const products = await db.collection("products").find().toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST product
app.post('/products', async (req, res) => {
  try {
    const newProduct = req.body;
    await db.collection("products").insertOne(newProduct);
    res.json({ message: "Product added ✅" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

// server start
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
