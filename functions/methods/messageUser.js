const db = require('../db')
const {refreshTokenIfNeeded, appendItems} = require('../gsheets')
const {getDate} = require('../date')
const sms = require('../twilio')

module.exports = ({questions, spreadsheetId, phone, credId, userId, row}, id, ref) => {
  return db.collection('credentials').doc(credId).get()
    .then(credentials => {
      const {refresh_token, access_token} = credentials.val()
      return refreshTokenIfNeeded(appendItems([[getDate()]], 'A1', spreadsheetId))(credId, refresh_token, access_token)
    })
    .then(() => {
      return db.collection('users').doc(userId).update({index: 0, row: row ? row + 1 : 2 })
    })
    .then(() => sms(phone, questions[0]))
    .then(() => ref.delete())
    .catch(err => Promise.reject(new Error('Failed to send initial message. ' + err)))
}
