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
  .onCreate(
      (snap, context) => googleAuth(snap.data(), snap.id)
        .catch(e => console.log(e))
  )


exports.onHour = functions.pubsub.schedule('every 1 hours synchronized')
  .onRun(
    context => checkForUsers(new Date().getUTCHours(), new Date().getUTCDay())
        .catch(e => console.log(e))
  )


exports.onUserUpdate = functions.firestore.document('users/{userId}')
  .onUpdate(
    change => Promise.all([
        verifyPhoneNumber(change.before.data(), change.after.data(), change.after.id),
        initialQuestions(change.before.data(), change.after.data(), change.after.id)
      ])
      .catch(e => console.log(e))
  )


exports.onQueueCreate = functions.firestore.document('queue/{taskId}')
  .onCreate(
    snap => messageUser(snap.data(), snap.id, snap.ref)
      .catch(e => console.log(e))
  )

exports.incomingSMS = functions.https.onRequest((req, res) => incomingSMS(req.body, res)
  .catch(err => {
    console.log(err)
    res.send('')
  })
)

/* Tests */
exports.test = functions.https.onRequest((req, res) =>
  googleAuth(req.body.data, req.body.id)
  .then(r => res.send(r))
  .catch(e => res.status(500).send('' + e))

// functions.https.onRequest((req, res) =>
//   initialQuestions(req.body.before, req.body.after, req.body.after.id)
//   .then(r => res.send(r))
//   .catch(e => res.status(500).send('' + e))
)
