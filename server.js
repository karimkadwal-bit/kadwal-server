const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ✅ YOUR MONGODB URI
const uri =
"mongodb+srv://karim:karim122@cluster0.70ffkmb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

let db;

// ✅ CONNECT DATABASE
async function startServer() {

  try {

    await client.connect();

    console.log("✅ MongoDB Connected");

    db = client.db("kadwalDB");

    // =========================
    // HOME
    // =========================

    app.get("/", (req, res) => {

      res.send("Kadwal Marketplace server running");

    });

    // =========================
    // PRODUCTS
    // =========================

    app.get("/products", async (req, res) => {

      const products = await db
        .collection("products")
        .find({})
        .toArray();

      res.json(products);

    });

    app.post("/products", async (req, res) => {

      await db
        .collection("products")
        .insertOne(req.body);

      res.json({
        message: "Product Added"
      });

    });

    app.delete("/products/:id", async (req, res) => {

      await db
        .collection("products")
        .deleteOne({
          _id: new ObjectId(req.params.id)
        });

      res.json({
        message: "Product Deleted"
      });

    });

    // =========================
    // SIGNUP
    // =========================

    app.post("/signup", async (req, res) => {

      const { username, password } = req.body;

      const oldUser = await db
        .collection("users")
        .findOne({
          username
        });

      if (oldUser) {

        return res.json({
          message: "Username already exists"
        });

      }

      await db
        .collection("users")
        .insertOne({
          username,
          password
        });

      res.json({
        message: "Signup Successful"
      });

    });

    // =========================
    // LOGIN
    // =========================

    app.post("/login", async (req, res) => {

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

    // =========================
    // START SERVER
    // =========================

    app.listen(PORT, () => {

      console.log("🚀 Server Running On Port " + PORT);

    });

  } catch (error) {

    console.log(error);

  }

}

startServer();
