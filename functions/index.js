const functions = require('firebase-functions')
const db = require('./db')
const fetch = require('node-fetch')
const sendSms = require('./twilio')


exports.googleAuth = functions.firestore.document('users/{userId}').onCreate((snap, context) => {
  if (!snap.data().code) {
    return false
  }
  let url = 'https://www.googleapis.com/oauth2/v4/token?'
  url += `code=${snap.data().code}&`
  url += `client_id=${functions.config().google.client_id}&`
  url += `client_secret=${functions.config().google.client_secret}&`
  url += `redirect_uri=${encodeURIComponent('https://27c6e919.ngrok.io/auth')}&`
  url += 'grant_type=authorization_code'

  return fetch(url, {method: 'POST'})
  .then(response => response.json())
  .then(json => {
    snap.ref.set({
      id_token: json.id_token,
    })
    return db.collection('credentials').doc(userId).set(json)
  })
  .catch(err => snap.ref.update({error: 'An error occurred! ' + err + ',' + db}))
})

exports.checkForUsers = functions.pubsub.topic('tinyjournal_hourly').onPublish(() => {
  const date = new Date()
  const weeklyUsers = db.collection('users').where('day', '==', date.getUTCDay()).where('hour', '==', date.getUTCHours())
  const dailyUsers = db.collection('users').where('day', '==', -1).where('hour', '==', date.getUTCHours())

  return Promise.resolve([weeklyUsers, dailyUsers])
    .then(([weeklyUsers, dailyUsers]) => {
      const batch = db.batch()
      if (!weeklyUsers.empty) {
        weeklyUsers.forEach(user => batch.set(db.collection('queue').doc(), users.data()))
      }
      if (!dailyUsers.empty) {
        dailyUsers.forEach(user => batch.set(db.collection('queue').doc(), users.data()))
      }
      return batch.commit()
    })

})

this.initialMessage = functions.firestore.document('queue/{taskId}').onCreate((snap, context) => {
  const {number, questions} = snap.data()

  //Send initial sms to a user and set appropriate sheet fields
})

exports.messageResponse = () => {
  //Record message response and send next question if applicable.
}




exports.sendSms = functions.https.onRequest((req, res) => {
  const message = req.query.text;
  sendSms('+314-210-7659', message);
})
