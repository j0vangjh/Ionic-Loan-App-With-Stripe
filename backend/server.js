const express = require('express'); 
const stripe = require('stripe')('sk_test_51MR7fsFGpAWUri8AQTCqVz3fIe0CBSPKeMh9WCW3McJiGajxGK1rsKrszS4hooxxL8KJ5DfBP7wvm9q9P2QQHCbJ00i4yo4G0t');
const cors = require('cors');
const bodyParser = require('body-parser');
const firebase = require('firebase/app');
require('firebase/firestore');

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCT5dQAubM_xSXM6m6LGsRzk4H3pLo5p_k',
  authDomain: 'msa2024s2.firebaseapp.com',
  projectId: 'msa2024s2',
  storageBucket: 'msa2024s2.firebasestorage.app',
  messagingSenderId: '403609825981',
  appId: '1:403609825981:web:48e1aa9db415de4934fdd4',
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