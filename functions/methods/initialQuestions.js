const db = require('../db')
const {refreshTokenIfNeeded, createSheet, appendItems, formatRow} = require('../gsheets')
const {getDate} = require('../date')

module.exports = (before, after, id) => {
  const questions = after.questions
  if (before.questions !== after.questions) {
    return db.collection('credentials').doc(id).get()
      .then(credentials => {
        const {refresh_token, access_token} = credentials.data()
        if (after.spreadsheetId) {
          return spreadsheetId
        }
        return refreshTokenIfNeeded(createSheet('Tiny Journal'))(id, refresh_token, access_token)
      })
      .then(spreadsheetId =>
        Promise.all([
          db.collection('users').doc(id).update({spreadhseetId, index: 0}),
          appendItems([[getDate()].concat(questions)], 'A1', spreadsheetId)(token),
          formatRow(0, spreadsheetId)(token)
        ])
      )
      .then(() => sms(after.phone, 'You\'re all set up! ❤️📓 -Tiny Journal'))
  }
  return null
}
