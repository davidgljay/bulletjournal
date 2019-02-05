const functions = require('firebase-functions')
const db = require('./db')
const fetch = require('node-fetch')

module.exports.refreshTokenIfNeeded = call => (credId, refresh, token) =>
  Promise.all([call(token), token])
    .catch(() => {
      let url = 'https://www.googleapis.com/oauth2/v4/token?'
      url += `refresh_token=${refresh}&`
      url += `client_id=${functions.config().google.client_id}&`
      url += `client_secret=${functions.config().google.client_secret}&`
      url += 'grant_type=refresh_token'

      let access_token
      return fetch(url, {
          method: 'POST'
        })
        .then(res => res.ok ? res.json() : Promise.reject(new Error('Failed to refresh token')))
        .then(json => {
            access_token = json.access_token
            return db.collection('credentials').doc(credId).update({
              access_token
            })
          })
        .then(() => Promise.all([
            call(access_token),
            access_token
          ])
        )
      })

module.exports.createSheet = name => token =>
  fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      properties:{
        title: 'Tiny Journal'
      }
    })
  })
  .then(res => res.ok ? res.json() : Promise.reject(new Error('Failed to create spreadsheet')))
  .then(json => json.spreadsheetId)

module.appendItems = (items, range, spreadsheetId) => token =>
  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?insertDataOption=INSERT_ROWS&valueInputOption=RAW`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        range,
        values: [items]
      })
    }
  )
  .then(res => res.ok ? res.json() : Promise.reject(new Error('Failed to append items to spreadsheet')))

module.formatRow = (row, spreadsheetId) => token =>
  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      "requests": [
        {
          "repeatCell": {
            "range": {
              "startRowIndex": row,
              "endRowIndex": row + 1
            },
            "cell": {
              "userEnteredFormat": {
                "backgroundColor": {
                  "red": 0.0,
                  "green": 158.0,
                  "blue": 85.0
                },
                "horizontalAlignment" : "CENTER",
                "textFormat": {
                  "foregroundColor": {
                    "red": 1.0,
                    "green": 1.0,
                    "blue": 1.0
                  },
                  "fontSize": 12,
                  "bold": true
                }
              }
            },
            "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
          }
        },
        {
          "updateBorders": {
            "range": {
              "startRowIndex": row,
              "endRowIndex": row + 1,
              "startColumnIndex": 0,
              "endColumnIndex": 100
            },
            "bottom": {
              "style": "SOLID",
              "width": 1,
              "color": {
                "red": 1.0,
                "green": 1.0,
                "blue": 1.0
              },
            }
          }
        },
        {
          "updateSheetProperties": {
            "properties": {
              "gridProperties": {
                "frozenRowCount": 1
              }
            },
            "fields": "gridProperties.frozenRowCount"
          }
        }
      ]
    })
  })
  .then(res => res.ok ? res.json() : Promise.reject(new Error('Failed to format row')))
