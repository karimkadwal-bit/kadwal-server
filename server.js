const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());

const uri = "mongodb+srv://karim:ZdgHjYsrs0COMMp7@cluster0.70ffkmb.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("kadwalDB");
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
  }
}

connectDB();

// GET all products
app.get('/products', async (req, res) => {
  const data = await db.collection("products").find().toArray();
  res.json(data);
});

// POST new product
app.post('/products', async (req, res) => {
  const newProduct = req.body;

  await db.collection("products").insertOne(newProduct);

  res.json({ message: "Product added" });
});

// DELETE product
app.delete('/products/:id', async (req, res) => {
  const id = req.params.id;

  await db.collection("products").deleteOne({
    _id: new ObjectId(id)
  });

  res.json({ message: "Product deleted" });
});

// UPDATE product
app.put('/products/:id', async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  await db.collection("products").updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedData }
  );

  res.json({ message: "Product updated" });
});

const PORT = process.env.PORT || 4242;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
