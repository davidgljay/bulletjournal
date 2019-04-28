const db = require('../db')
const {refreshTokenIfNeeded, createSheet, appendItems, formatRow} = require('../gsheets')
const sms = require('../twilio')

module.exports = (body, res) => {
  const text = body.Body.toLowerCase()
  const phone = body.From
  return db.collection('users').where('phone', '==', phone).get()
    .then(userQuery => userQuery.forEach(user => {
      switch(text) {
        case 'yes':
          return db.collection('users').doc(user.id).update({phoneConfirmed: true})
        case 'stop':
          return db.collection('users').doc(user.id).update({disabled: true})
        default:
          return questionResponse(body.Body, phone, user.data(), user.id)
      }
    })
  )
  .then(() => res.send(''))
}

const questionResponse = (text, phone, user, userId) => {

  const index = user.index || 0
  const row = user.row || 2
  const range = String.fromCharCode(98 + index).toUpperCase() + row + ':' + String.fromCharCode(98 + index).toUpperCase() + row
  return db.collection('credentials').doc(user.credId).get()
    .then(credentials => {
      const {access_token, refresh_token} = credentials.data()
      return refreshTokenIfNeeded(appendItems([[text]], range, user.spreadsheetId))(user.credId, refresh_token, access_token)
    })
    .then(() => {
      console.log(user.questions.length === index - 1)
      return user.questions.length === index + 1 ? sms(user.phone, 'All set for now!') : sms(user.phone, user.questions[index + 1])
    })
    .then(() => db.collection('users').doc(userId).update({index: user.questions.length === index + 1 ? 0 : index + 1 }))
}
