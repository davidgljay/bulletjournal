const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const sendSms = require('./twilio');
admin.initializeApp();

exports.helloWorld = functions.https.onRequest((req, res) => {
 res.send("Hello from Firebase!");
});

exports.getToken = functions.https.onRequest((req, res) => {
  let url = 'https://www.googleapis.com/oauth2/v4/token?'
  url += `code=${req.query.code}&`
  url += `client_id=${functions.config().google.client_id}&`
  url += `client_secret=${functions.config().google.client_secret}&`
  url += `redirect_uri=${encodeURIComponent('https://82adb641.ngrok.io/auth')}&`
  url += 'grant_type=authorization_code'
  console.log(req.query.code);
  console.log(url);

  return fetch(url, {method: 'POST'})
  .then(response => Promise.all([response.status, response.text()]))
  .then(([status, text]) => res.status(status).send(text))
  .catch(err => res.status(500).send(err))
})

exports.sendSms = functions.https.onRequest((req, res) => {
  const message = req.query.text;
  sendSms('+314-210-7659', message);
})

// exports.addMessage = functions.https.onRequest((req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text;
//   // Push the new message into the Realtime Database using the Firebase Admin SDK.
//   return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
//     // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//     return res.redirect(303, snapshot.ref.toString());
//   });
// });
