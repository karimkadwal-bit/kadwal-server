const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET = "kadwal_secret";

const uri = "mongodb+srv://karim:karim122@cluster0.70ffkmb.mongodb.net/kadwalDB?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

let db;

// CONNECT DB
async function connectDB(){
await client.connect();
db = client.db("kadwalDB");
console.log("MongoDB Connected");
}
connectDB();

// HOME
app.get("/", (req,res)=>{
res.send("Kadwal Secure API Running 🚀");
});

// SIGNUP
app.post("/signup", async (req,res)=>{
const {username,password} = req.body;

const userExists = await db.collection("users").findOne({username});
if(userExists){
return res.json({message:"User already exists"});
}

const hash = await bcrypt.hash(password,10);

await db.collection("users").insertOne({
username,
password:hash,
role:"user"
});

res.json({message:"Signup successful"});
});

// LOGIN
app.post("/login", async (req,res)=>{
const {username,password} = req.body;

const user = await db.collection("users").findOne({username});

if(!user){
return res.json({message:"User not found"});
}

const match = await bcrypt.compare(password,user.password);

if(!match){
return res.json({message:"Wrong password"});
}

const token = jwt.sign(
{ id:user._id, role:user.role, username:user.username },
SECRET,
{ expiresIn:"7d" }
);

res.json({
message:"Login successful",
token,
role:user.role
});
});

// AUTH MIDDLEWARE
function auth(req,res,next){
const token = req.headers.authorization;

if(!token){
return res.json({message:"No token"});
}

try{
const data = jwt.verify(token,SECRET);
req.user = data;
next();
}catch{
res.json({message:"Invalid token"});
}
}

// ADMIN CHECK
function admin(req,res,next){
if(req.user.role !== "admin"){
return res.json({message:"Admin only"});
}
next();
}

// GET PRODUCTS
app.get("/products", async (req,res)=>{
const products = await db.collection("products").find().toArray();
res.json(products);
});

// ADD PRODUCT
app.post("/products", auth, admin, async (req,res)=>{
await db.collection("products").insertOne(req.body);
res.json({message:"Product added"});
});

// DELETE PRODUCT
app.delete("/products/:id", auth, admin, async (req,res)=>{
await db.collection("products").deleteOne({_id:new ObjectId(req.params.id)});
res.json({message:"Product deleted"});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
console.log("Server running on port " + PORT);
});
