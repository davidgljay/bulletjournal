const functions = require('firebase-functions')
const db = require('./db')
const fetch = require('node-fetch')
const sms = require('./twilio')
const {refreshTokenIfNeeded, createSheet, appendItems, formatRow} = require('./gsheets')
const {
  googleAuth,
  checkForUsers,
  verifyPhoneNumber,
  initialQuestions,
  messageUser,
  incomingSMS
} = require('./methods')

exports.onUserCreate = functions.firestore.document('users/{userId}')
  .onCreate((snap, context) => googleAuth(snap.data(), snap.id))

exports.onPubsubPublish = functions.pubsub.topic('tinyjournal_hourly')
  .onPublish(checkForUsers)

exports.onUserUpdate = functions.firestore.document('users/{userId}')
  .onUpdate(change => Promise.all([
      verifyPhoneNumber(change.before.data(), change.after.data(), change.after.id),
      initialQuestions(change.before.data(), change.after.data(), change.after.id)
    ]))

exports.onQueueCreate = functions.firestore.document('queue/{taskId}')
  .onCreate(snap => messageUser(snap.data(), snap.id))

exports.incomingSMS = functions.https.onRequest((req, res) => incomingSMS(req.body, res))


// exports.sendSms = functions.https.onRequest((req, res) => {
//   const message = req.query.text
//   console.log(sms);
//   sms('+314-210-7659', message)
//   res.send('')
// })
