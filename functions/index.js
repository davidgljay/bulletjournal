const functions = require('firebase-functions')
const db = require('./db')
const fetch = require('node-fetch')
const sms = require('./twilio')
const {refreshTokenIfNeeded, createSheet, appendItems, formatRow} = require('./ghseets')


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

this.verifyPhoneNumber = functions.firestore.document('users/{userId}').onUpdate(change => {
  if (change.after.data().phoneConfirm !== false) {
    return true
  }
  return sms(change.after.data().phone, 'Hello from TinyJournal! If you would like to enable sms journalling please respond "YES". You can type "STOP" at any time.')
})

this.initialQuestions = functions.firestore.document('users/{userId}').onUpdate((change, context) => {
    const {userId} = context
    const questions = change.after().data().questions
    if (change.before.data().questions !== change.after.data().questions) {
      return db.collection('credentials').doc(userId).get()
        .then(credentials => {
          const {refresh_token, access_token} = credentials.data()
          return refreshTokenIfNeeded(createSheet('Tiny Journal'))(userId, refresh_token, access_token)
        })
        .then(spreadsheetId =>
          Promise.all([
            db.collection('users').doc(userId).update({spreadhseetId, index: 0}),
            appendItems([[getDate()].concat(questions)], 'A1', spreadsheetId)(token),
            formatRow(0, spreadsheetId)(token)
          ])
        )
        .then(() => sendSms(change.after().data().phone, 'You\'re all set up! ❤️📓 -Tiny Journal'))
    }
    return null
  })

exports.incomingSMS = functions.https.onRequest((req, res) => {
  res.send('')
  const text = req.body.text.toLowerCase()
  const phone = req.body.phone
  return db.collect('users').where('phone', '==', phone).get()
    .then(userQuery => userQuery.forEach(user => {
      switch(text) {
        case 'yes':
          return user.update({confirmation: 'confirmed'})
        case 'stop':
          return user.update({disabled: true})
        default:
          return questionResponse(text, phone, user.data())
    }))
  }
})

const questionResponse = (text, phone, user) => {
  const index = user.index || 0
  const column = String.fromCharCode(97 + index).toUpperCase() + '1'

  return db.collection('credentials').doc(user.uid).get()
    .then(credentials => {
      const {access_token, refresh_token} = credentials.data()
      return refreshTokenIfNeeded(appendItems([[text]], column, user.spreadsheet1))(access_token, refresh_token)
    })
    .then(() => sendSms(user.phone, user.questions[index + 1]))
    .then(() => db.collections('users').doc(user.uid).update({index: index + 1}))
}

const getDate() => {
  const d = new Date()
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getYear() - 100}`
}

exports.sendSms = functions.https.onRequest((req, res) => {
  const message = req.query.text
  console.log(sms);
  sms('+314-210-7659', message)
  res.send('')
})
