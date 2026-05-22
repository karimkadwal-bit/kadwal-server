const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://karim:karim122@cluster0.70ffkmb.mongodb.net/kadwalDB?retryWrites=true&w=majority&appName=Cluster0";

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

app.get('/', (req, res) => {

  res.send("Kadwal Marketplace Server Running");

});

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
    message: "Product Added"
  });

});

app.delete('/products/:id', async (req, res) => {

  const id = req.params.id;

  await db
    .collection("products")
    .deleteOne({
      _id: new ObjectId(id)
    });

  res.json({
    message: "Product Deleted"
  });

});

app.post('/signup', async (req, res) => {

  const user = req.body;

  await db
    .collection("users")
    .insertOne(user);

  res.json({
    message: "Signup Successful"
  });

});

app.post('/login', async (req, res) => {

  const { username, password } = req.body;

  const user = await db
    .collection("users")
    .findOne({
      username,
      password
    });

  if (user) {

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
