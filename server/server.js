require("dotenv").config()

const express = require("express")
const app = express()
const cors = require("cors")
app.use(express.json())
app.use(
  cors({
    origin: "http://localhost:5500",
  })
)

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const color = new Map([
  [1, { colors: '#445c42' }], 
  [2, { colors: '#ffc9cf' }], 
  [3, { colors: '#0b839e' }], 
  [4, { colors: '#092732' }], 
  [5, { colors: '#e0dbd7' }], 
  [6, { colors: '#cf4f68' }], 
])

const storeItems = new Map([
  [1, { priceInCents: 649900, name: 'iPhone 13'}]
])

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(item.id)
        return {
          price_data: {
            currency: "brl",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        }
      }),
      success_url: `${process.env.CLIENT_URL}/success.html`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
    })
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.listen(3000)