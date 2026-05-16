const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();

app.use(cors());
app.use(express.json());

const uri = "PASTE_YOUR_MONGODB_URI_HERE";

const client = new MongoClient(uri);

let db;

async function connectDB() {

  try {

    await client.connect();

    db = client.db("kadwalDB");

    console.log("MongoDB Connected");

  } catch (error) {

    console.log(error);

  }

}

connectDB();

app.get('/products', async (req, res) => {

  try {

    const products = await db
      .collection("products")
      .find({})
      .toArray();

    res.json(products);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

app.post('/products', async (req, res) => {

  try {

    const product = req.body;

    const result = await db
      .collection("products")
      .insertOne(product);

    res.json(result);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

app.delete('/products/:id', async (req, res) => {

  try {

    const id = req.params.id;

    const result = await db
      .collection("products")
      .deleteOne({
        _id: new ObjectId(id)
      });

    res.json(result);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});
