const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

let products = [
  {
    name: "iPhone",
    price: 999,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
  }
];

app.get('/products', (req, res) => {

  res.json(products);

});

app.post('/products', (req, res) => {

  const product = req.body;

  products.push(product);

  res.json({
    message: "Product added"
  });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log("Server running");

});
