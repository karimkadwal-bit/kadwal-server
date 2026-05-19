const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/', (req, res) => {

  res.send("Kadwal Server Running");

});

app.get('/products', (req, res) => {

  res.json([
    {
      name: "iPhone",
      price: 999
    },
    {
      name: "Car",
      price: 100000
    }
  ]);

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log("Server running");

});
