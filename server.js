const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET = "kadwal_secret";

const uri = "mongodb+srv://karim:karim122@cluster0.70ffkmb.mongodb.net/kadwalDB?retryWrites=true&w=majority";

const client = new MongoClient(uri);

let db;

async function connectDB(){
await client.connect();
db = client.db("kadwalDB");
console.log("MongoDB Connected");
}
connectDB();

app.get("/", (req,res)=>{
res.send("Kadwal API Running 🚀");
});

// SIGNUP
app.post("/signup", async (req,res)=>{
const {username,password} = req.body;

const exist = await db.collection("users").findOne({username});
if(exist){
return res.json({message:"User exists"});
}

const hash = await bcrypt.hash(password,10);

await db.collection("users").insertOne({
username,
password:hash,
role:"user"
});

res.json({message:"Signup success"});
});

// LOGIN
app.post("/login", async (req,res)=>{
const {username,password} = req.body;

const user = await db.collection("users").findOne({username});

if(!user){
return res.json({message:"User not found"});
}

const ok = await bcrypt.compare(password,user.password);

if(!ok){
return res.json({message:"Wrong password"});
}

const token = jwt.sign(
{ id:user._id, role:user.role },
SECRET,
{ expiresIn:"7d" }
);

res.json({
message:"Login success",
token,
role:user.role
});
});

// PRODUCTS (READ ONLY SAFE)
app.get("/products", async (req,res)=>{
const data = await db.collection("products").find().toArray();
res.json(data);
});

app.listen(3000, ()=>{
console.log("Server Running");
});
