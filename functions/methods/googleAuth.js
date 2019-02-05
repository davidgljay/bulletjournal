const functions = require('firebase-functions')
const db = require('../db')
const fetch = require('node-fetch')

module.exports = (data, id, ref) => {
  if (!data.code) {
    return false
  }
  const userId = id
  let url = 'https://www.googleapis.com/oauth2/v4/token?'
  url += `code=${data.code}&`
  url += `client_id=${functions.config().google.client_id}&`
  url += `client_secret=${functions.config().google.client_secret}&`
  url += `redirect_uri=${encodeURIComponent('https://tinyjournal.us/auth')}&`
  url += 'grant_type=authorization_code'

  return fetch(url, {method: 'POST'})
  .then(response => response.json())
  .then(json => {
    ref.update({
      id_token: json.id_token
    })
    return db.collection('credentials').add(Object.assign({}, json, {userId}))
      .then(cred => db.collection('users').doc(userId).update({credId: cred.id}))
  })
  .catch(err => console.log('An error occurred! ' + err))
}
