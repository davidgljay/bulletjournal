const functions = require('firebase-functions')
const db = require('./db')
const fetch = require('node-fetch')
const sms = require('./twilio')
const {refreshTokenIfNeeded, createSheet, appendItems, formatRow} = require('./gsheets')


exports.googleAuth = functions.firestore.document('users/{userId}').onCreate((snap, context) => {
  if (!snap.data().code) {
    return false
  }
  const userId = snap.id
  let url = 'https://www.googleapis.com/oauth2/v4/token?'
  url += `code=${snap.data().code}&`
  url += `client_id=${functions.config().google.client_id}&`
  url += `client_secret=${functions.config().google.client_secret}&`
  url += `redirect_uri=${encodeURIComponent('https://dj-bullet-journal.firebaseapp.com/auth')}&`
  url += 'grant_type=authorization_code'

  return fetch(url, {method: 'POST'})
  .then(response => response.json())
  .then(json => {
    snap.ref.update({
      id_token: json.id_token
    })
    return db.collection('credentials').doc(userId).set(json)
  })
  .catch(err => console.log('An error occurred! ' + err))
})

exports.checkForUsers = functions.pubsub.topic('tinyjournal_hourly').onPublish(() => {
  const date = new Date()
  const weeklyUsers = db.collection('users').where('day', '==', date.getUTCDay()).where('hour', '==', date.getUTCHours())
  const dailyUsers = db.collection('users').where('day', '==', -1).where('hour', '==', date.getUTCHours())

  return Promise.all([weeklyUsers, dailyUsers])
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

exports.verifyPhoneNumber = functions.firestore.document('users/{userId}').onUpdate(change => {
  if (change.after.data().phoneConfirm !== false) {
    return null
  }
  return sms(change.after.data().phone, 'Hello from TinyJournal! If you would like to enable sms journalling please respond "YES". You can type "STOP" at any time.')
    .then(res => res.ok ? res.json() : Promise.reject(res.text()))
    .then(json => console.log(json))
    .catch(err => console.log(err))
})

exports.initialQuestions = functions.firestore.document('users/{userId}').onUpdate((change, context) => {
    const questions = change.after.data().questions
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
        .then(() => sms(change.after.data().phone, 'You\'re all set up! ❤️📓 -Tiny Journal'))
    }
    return null
  })

exports.messageUser = functions.firestore.document('queue/{taskId}').onCreate((snap, context) => {
  const {id, questions, spreadsheetId, phone} = snap.data()
  return db.collection('credentials').doc(id).get()
    .then(credentials => {
      const {refresh_token, access_token} = credentials.data()
      return refreshTokenIfNeeded(appendItems([[getDate()]], 'A1', spreadsheetId))(access_token, refresh_token)
    })
    .then(() => collection('users').doc(id).update({index: 0}))
    .then(() => sms(phone, questions[0]))
    .then(() => snap.delete())
    .catch(err => console.log('Error sending initial question to user', err))
})

exports.incomingSMS = functions.https.onRequest((req, res) => {
  res.send('')
  const text = req.body.Body.toLowerCase()
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
      }
    })
  )
})

const questionResponse = (text, phone, user) => {
  const index = user.index || 0
  const column = String.fromCharCode(97 + index).toUpperCase() + '1'

  return db.collection('credentials').doc(user.id).get()
    .then(credentials => {
      const {access_token, refresh_token} = credentials.data()
      return refreshTokenIfNeeded(appendItems([[text]], column, user.spreadsheetId))(access_token, refresh_token)
    })
    .then(() => sms(user.phone, user.questions[index + 1]))
    .then(() => db.collections('users').doc(user.id).update({index: index + 1}))
}

const getDate = () => {
  const d = new Date()
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getYear() - 100}`
}

// exports.sendSms = functions.https.onRequest((req, res) => {
//   const message = req.query.text
//   console.log(sms);
//   sms('+314-210-7659', message)
//   res.send('')
// })
