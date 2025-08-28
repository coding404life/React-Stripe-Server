const express = require("express");
const cors = require("cors");
require("dotenv").config();

const StripeApiKey = process.env.STRIPE_PRIVATE_KEY;
const DOMAIN = `${process.env.CLIENT_URL}`;
const stripe = require("stripe")(`${StripeApiKey}`);
const app = express();
const PORT = 4242;

app.use(express.static("public"));
app.use(cors({ origin: DOMAIN }));
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const items = req.body.items.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price,
      },
      quantity: item.amount,
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: items,
      mode: "payment",
      success_url: `${DOMAIN}?success=true`,
      cancel_url: `${DOMAIN}?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/", async (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
