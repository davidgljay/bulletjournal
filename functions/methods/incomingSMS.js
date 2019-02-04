const db = require('../db')
const {refreshTokenIfNeeded, createSheet, appendItems, formatRow} = require('../gsheets')

module.exports = (body, res) => {
  const text = body.Body.toLowerCase()
  const phone = body.From
  console.log('phone', phone)
  return db.collection('users').where('phone', '==', phone).get()
    .then(userQuery => userQuery.forEach(user => {
      console.log('user', user)
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
  const column = String.fromCharCode(97 + index).toUpperCase() + '1'

  return db.collection('credentials').doc(userId).get()
    .then(credentials => {
      const {access_token, refresh_token} = credentials.data()
      return refreshTokenIfNeeded(appendItems([[text]], column, user.spreadsheetId))(access_token, refresh_token)
    })
    .then(() => sms(phone, user.questions[index + 1]))
    .then(() => db.collection('users').doc(userId).update({index: index + 1}))
}
