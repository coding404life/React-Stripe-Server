const express = require("express");
const cors = require("cors");
require("dotenv").config();

const StripeApiKey = process.env.STRIPE_API_KEY;
const stripe = require("stripe")(`${StripeApiKey}`);

const app = express();
const PORT = 4242;

app.use(express.static("public"));
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const YOUR_DOMAIN = "http://localhost:5173";

app.post("/create-checkout-session", async (req, res) => {
  const items = req.body.items.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.price,
      },
      quantity: item.amount,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: items,
    mode: "payment",
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.send(session.url);
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
