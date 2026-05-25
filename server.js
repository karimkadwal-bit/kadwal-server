const express = require('express');

const cors = require('cors');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const { MongoClient, ObjectId } = require('mongodb');

const app = express();

app.use(cors());

app.use(express.json());

const SECRET_KEY = "kadwal_secret_key";

const uri =
"mongodb+srv://karim:karim122@cluster0.70ffkmb.mongodb.net/kadwalDB?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

let db;

async function connectDB(){

try{

await client.connect();

db = client.db("kadwalDB");

console.log("MongoDB Connected");

}catch(error){

console.log(error);

}

}

connectDB();

function verifyToken(req,res,next){

const token = req.headers.authorization;

if(!token){

return res.json({
message:"Access Denied"
});

}

try{

const verified =
jwt.verify(token, SECRET_KEY);

req.user = verified;

next();

}catch(error){

res.json({
message:"Invalid Token"
});

}

}

function verifyAdmin(req,res,next){

if(req.user.role !== "admin"){

return res.json({
message:"Admin Only"
});

}

next();

}

app.get('/',(req,res)=>{

res.send(
"Kadwal Secure Marketplace Server Running 🚀"
);

});

app.post('/signup', async(req,res)=>{

const { username,password } = req.body;

const existingUser =
await db.collection("users").findOne({
username
});

if(existingUser){

return res.json({
message:"User already exists"
});

}

const hashedPassword =
await bcrypt.hash(password,10);

await db.collection("users").insertOne({

username,

password:hashedPassword,

role:"user"

});

res.json({
message:"Signup Successful"
});

});

app.post('/adminsignup', async(req,res)=>{

const { username,password } = req.body;

const hashedPassword =
await bcrypt.hash(password,10);

await db.collection("users").insertOne({

username,

password:hashedPassword,

role:"admin"

});

res.json({
message:"Admin Created"
});

});

app.post('/login', async(req,res)=>{

const { username,password } = req.body;

const user =
await db.collection("users").findOne({
username
});

if(!user){

return res.json({
message:"User Not Found"
});

}

const validPassword =
await bcrypt.compare(
password,
user.password
);

if(!validPassword){

return res.json({
message:"Wrong Password"
});

}

const token = jwt.sign({

id:user._id,

username:user.username,

role:user.role

},
SECRET_KEY
);

res.json({

message:"Login Successful",

token,

role:user.role

});

});

app.get('/products', async(req,res)=>{

const products =
await db.collection("products")
.find({})
.toArray();

res.json(products);

});

app.post(
'/products',

verifyToken,

verifyAdmin,

async(req,res)=>{

const product = req.body;

await db.collection("products")
.insertOne(product);

res.json({
message:"Product Added"
});

});

app.delete(
'/products/:id',

verifyToken,

verifyAdmin,

async(req,res)=>{

const id = req.params.id;

await db.collection("products")
.deleteOne({
_id:new ObjectId(id)
});

res.json({
message:"Product Deleted"
});

});

const PORT =
process.env.PORT || 3000;

app.listen(PORT,()=>{

console.log(
"Secure Server running on port " + PORT
);

});
