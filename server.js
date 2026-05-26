const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {

res.send(
"Kadwal Marketplace Server Running"
);

});

app.post("/signup",(req,res)=>{

const {email,password} = req.body;

console.log(email,password);

res.send("Signup Successful");

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

console.log(
`Server Running On Port ${PORT}`
);

});
