const db = require('../db')
const {refreshTokenIfNeeded, appendItems} = require('../gsheets')
const {getDate} = require('../date')

module.exports = ({questions, spreadsheetId, phone}, id) => {
  return db.collection('credentials').doc(id).get()
    .then(credentials => {
      const {refresh_token, access_token} = credentials.data()
      return refreshTokenIfNeeded(appendItems([[getDate()]], 'A1', spreadsheetId))(access_token, refresh_token)
    })
    .then(() => collection('users').doc(id).update({index: 0}))
    .then(() => sms(phone, questions[0]))
    .then(() => collection('queue').doc(id).delete())
    .catch(err => console.log('Error sending initial question to user', err))
}
