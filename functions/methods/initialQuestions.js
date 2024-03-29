const db = require('../db')
const {refreshTokenIfNeeded, createSheet, appendItems, formatRow} = require('../gsheets')
const {getDate} = require('../date')
const sms = require('../twilio')

module.exports = (before, after, id) => {
  if (!after.questions) {
    return null
  }
  const questions = after.questions
  let spreadsheet
  let accessToken
  let refreshToken
  if (!before.questions || before.questions.length === 0 || before.questions.toString() !== after.questions.toString()) {
    return db.collection('credentials').doc(before.credId).get()
      .then(credentials => {
        const {refresh_token, access_token} = credentials.val()
        refreshToken = refresh_token
        if (after.spreadsheetId) {
          return [after.spreadsheetId, access_token]
        }
        return refreshTokenIfNeeded(createSheet('Tiny Journal'))(before.credId, refresh_token, access_token)
      })
      .then(([spreadsheetId, token]) => {
        spreadsheet = spreadsheetId
        accessToken = token
        return db.collection('users').doc(id).update({spreadsheetId, index: 0})
      })
      .then(() => refreshTokenIfNeeded(appendItems([[getDate()].concat(questions)], 'A1', spreadsheet))(before.credId, refreshToken, accessToken))
      .then(([_, token]) => formatRow(0, spreadsheet)(token))
      .then(() => db.collection('queue').add(Object.assign({}, after, {userId: id})))
  }
  return null
}
