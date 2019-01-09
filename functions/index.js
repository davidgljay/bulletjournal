const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const sendSms = require('./twilio');
admin.initializeApp();

exports.googleAuth = functions.firestore.document('users/{userId}').onCreate((snap, context) => {
  if (!snap.data().code) {
    return false
  }
  let url = 'https://www.googleapis.com/oauth2/v4/token?'
  url += `code=${snap.data().code}&`
  url += `client_id=${functions.config().google.client_id}&`
  url += `client_secret=${functions.config().google.client_secret}&`
  url += `redirect_uri=${encodeURIComponent('https://82adb641.ngrok.io/auth')}&`
  url += 'grant_type=authorization_code'

  return fetch(url, {method: 'POST'})
  .then(response => response.json())
  .then(json => {
    snap.ref.set({id_token: json.id_token}) //Update to "remove code"
    functions.firestore.collection('credentials').doc(userId).set(json)
  })
  .catch(err => snap.ref.update({error: 'An error occurred! ' + err}))
})

exports.checkForUsers = functions.https.onRequest((req, res) => {
  //Get users for this hour
  //Publish each as a pubsub message
})

exports.initialMessage = () => {
  //Send initial sms to a user and set appropriate sheet fields
}

exports.messageResponse = () => {
  //Record message response and send next question if applicable.
}




exports.sendSms = functions.https.onRequest((req, res) => {
  const message = req.query.text;
  sendSms('+314-210-7659', message);
})
