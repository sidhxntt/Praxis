import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();

export function payments(app) {
  // Webhook endpoint for LemonSqueezy
  app.post("/webhook/lemonsqueezy", (req, res) => {
    console.log("Webhook received!");

    const signature = req.headers["x-signature"];
    const payload = req.body;

    console.log("Received signature:", signature);

    if (!signature) {
      console.log("Warning: No signature found in headers!");
      console.log("Available headers:", Object.keys(req.headers));
      return res.status(400).send("No signature provided");
    }

    // Verify webhook signature using raw body
    const computedSignature = crypto
      .createHmac("sha256", process.env.WEBHOOK_SECRET)
      .update(req.rawBody)
      .digest("hex");

    console.log("Computed signature:", computedSignature);

    // Check if signatures match
    if (computedSignature !== signature) {
      console.log("Invalid webhook signature");
      console.log(`Expected: ${computedSignature}`);
      console.log(`Received: ${signature}`);
      return res.status(401).send("Invalid signature");
    }

    // Process the event based on its type
    const eventName = payload.meta.event_name;

    switch (eventName) {
      case "order_created":
        console.log("-".repeat(40));
        console.log("🍋 New order created!");
        console.log(`Order ID: ${payload.data.id}`);
        console.log(`Product ID: ${payload.data.attributes.first_order_item.product_id}`);
        console.log(`Product Name: ${payload.data.attributes.first_order_item.product_name}`);
        console.log(`Customer: ${payload.data.attributes.user_email}`);
        console.log(
          `Amount: $${(payload.data.attributes.total / 100).toFixed(2)}`
        );
        console.log(`Status: ${payload.data.attributes.status}`);
        console.log("-".repeat(40));
        break;

      case "order_refunded":
        console.log("-".repeat(40));
        console.log("🍋 Order refunded!");
        console.log(`Order ID: ${payload.data.id}`);
        console.log(
          `Refund Amount: $${(
            payload.data.attributes.refunded_amount / 100
          ).toFixed(2)}`
        );
        console.log("-".repeat(40));
        break;

      case "subscription_created":
        console.log("-".repeat(40));
        console.log("🍋 New subscription created!");
        console.log(`Subscription ID: ${payload.data.id}`);
        console.log(`Customer: ${payload.data.attributes.user_email}`);
        console.log(`Status: ${payload.data.attributes.status}`);
        console.log("-".repeat(40));
        break;

      case "subscription_updated":
        console.log("-".repeat(40));
        console.log("🍋 Subscription updated!");
        console.log(`Subscription ID: ${payload.data.id}`);
        console.log(`New Status: ${payload.data.attributes.status}`);
        console.log("-".repeat(40));
        break;

      default:
        console.log("-".repeat(40));
        console.log(`🍋 Received event: ${eventName}`);
        console.log("Payload:", JSON.stringify(payload, null, 2));
        console.log("-".repeat(40));
    }

    // Acknowledge receipt of the event
    res.status(200).send("Webhook received");
  });
}
