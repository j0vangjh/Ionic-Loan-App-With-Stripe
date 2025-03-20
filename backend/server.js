const express = require('express'); 
const stripe = require('stripe')('Your secret key');
const cors = require('cors');
const bodyParser = require('body-parser');
const firebase = require('firebase/app');
require('firebase/firestore');

// Initialize Firebase
const firebaseConfig = {
// Your firebase credentials
};  

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// Create express application
const app = express();
const PORT = process.env.PORT || 4242;

app.use(cors());

// Use raw body parser for webhook endpoint
app.post('/webhook', bodyParser.raw({type: 'application/json'}));
// Use JSON body parser for all other routes
app.use(bodyParser.json());
// Route to create a stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { amount, description, loanId, userEmail, userUid } = req.body;

    const session = await stripe.checkout.sessions.create({
      success_url: `http://localhost:8100/thankyou?loanId=${loanId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:8100/loans?payment=cancel`,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: description || 'Loan Fine Payment',
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        loanId,
        username: userEmail, // Use 'username' instead of 'userEmail'
        userUid
      },
    });
    console.log('Session:', session);
    res.status(200).send({ url: session.url , id:session.id, payment_intent: session.payment_intent}); // Return the session URL
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).send({ error: error.message });
  }
});

// Start the express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});