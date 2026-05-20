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
  },

  {
    name: "Car",
    price: 100000,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7"
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

app.delete('/products/:index', (req, res) => {

  const index = req.params.index;

  products.splice(index, 1);

  res.json({
    message: "Product deleted"
  });

});

app.get('/', (req, res) => {

  res.send("Kadwal Marketplace Server Running");

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log("Server running on port " + PORT);

});
