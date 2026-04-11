const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Kadwal Marketplace Server 🚀");
});

app.get("/products", (req, res) => {
  res.json([
    { id: 1, name: "Phone", price: 200 },
    { id: 2, name: "Laptop", price: 800 }
  ]);
});

app.post("/products", (req, res) => {
  const product = req.body;
  res.json({
    message: "Product added successfully ✅",
    product: product
  });
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
