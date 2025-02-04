"# Ionic-Loan-App-With-Stripe" 

1. npm install @stripe/stripe-js in skippyQ and npm install --save stripe

2. Backend packages to install npm install express body-parser stripe cors dotenv

3. npm init -y

4. You need to change the server.js code in backend to your own firebase credentials

5. Cd backend and run server.js, it will run on local host 4242

6. Split your terminal and run ionic serve in the skippyQ not in backend

7. Run the code if it cant work go to the console you will see this error to create index for both loans and transactions

8. Click on the link and create the index in firebase, it should look something like that

9. After the index is created, the code should work as normally with the stripe payment, you need to change the date in your firebase to a date before today for the payFine() button to show up

10. That should be all if the code still cannot run you can try these packages that i installed but i dont think i used them in the end
npm install @stripe/stripe-js @stripe-elements/stripe-angular
npm install -g firebase-tools
firebase login
firebase init functions
npm install firebase-admin
