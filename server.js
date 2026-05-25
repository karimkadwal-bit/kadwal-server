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

async function connectDB(){
await client.connect();
db = client.db("kadwalDB");
console.log("MongoDB Connected");
}
connectDB();

app.get("/", (req,res)=>{
res.send("Kadwal Server Running 🚀");
});

// SIGNUP
app.post("/signup", async (req,res)=>{
const {username,password} = req.body;

const user = await db.collection("users").findOne({username});
if(user){
return res.json({message:"User already exists"});
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
{ id:user._id, role:user.role, username:user.username },
SECRET,
{ expiresIn:"7d" }
);

res.json({
message:"Login success",
token,
role:user.role
});
});

// AUTH
function auth(req,res,next){
const token = req.headers.authorization;
if(!token) return res.json({message:"No token"});

try{
const data = jwt.verify(token,SECRET);
req.user = data;
next();
}catch{
res.json({message:"Invalid token"});
}
}

// ADMIN
function admin(req,res,next){
if(req.user.role !== "admin"){
return res.json({message:"Admin only"});
}
next();
}

// PRODUCTS
app.get("/products", async (req,res)=>{
const data = await db.collection("products").find().toArray();
res.json(data);
});

app.post("/products", auth, admin, async (req,res)=>{
await db.collection("products").insertOne(req.body);
res.json({message:"Product added"});
});

app.delete("/products/:id", auth, admin, async (req,res)=>{
await db.collection("products").deleteOne({_id:new ObjectId(req.params.id)});
res.json({message:"Deleted"});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
console.log("Server running on " + PORT);
});
