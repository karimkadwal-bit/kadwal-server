const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const stripe = Stripe("YOUR_SECRET_KEY");

app.post("/create-checkout-session", async (req, res) => {
  const { items } = req.body;

  const line_items = items.map(item => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name
      },
      unit_amount: item.price * 100
    },
    quantity: 1
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: "https://example.com/success",
    cancel_url: "https://example.com/cancel"
  });

  res.json({ url: session.url });
});

app.listen(4242, () => console.log("Server running"));