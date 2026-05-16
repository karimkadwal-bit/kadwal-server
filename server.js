const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();

app.use(cors());
app.use(express.json());

const uri = "YOUR_MONGODB_URI";

const client = new MongoClient(uri);

let db;

async function connectDB() {

  await client.connect();

  db = client.db("kadwalDB");

  console.log("MongoDB Connected");

}

connectDB();

app.get('/products', async (req, res) => {

  const products = await db
    .collection("products")
    .find({})
    .toArray();

  res.json(products);

});

app.post('/products', async (req, res) => {

  const product = req.body;

  await db
    .collection("products")
    .insertOne(product);

  res.json({
    message: "Product added"
  });

});

app.delete('/products/:id', async (req, res) => {

  const id = req.params.id;

  await db.collection("products").deleteOne({
    _id: new ObjectId(id)
  });

  res.json({
    message: "Product deleted"
  });

});

app.listen(3000, () => {

  console.log("Server running on port 3000");

});
