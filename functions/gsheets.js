module.exports.createSheet = (name, token) =>
  fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.parse({
      properties:{
        title: 'Tiny Journal'
      }
    })
  })
  .then(res => res.ok ? res.json : Promise.reject('Failed to create spreadsheet'))
  .then(json => json.spreadsheetId)

module.appendItems = (items, range, spreadsheetId, token) =>
  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?insertDataOption=INSERT_ROWS&valueInputOption=RAW`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.parse({
      range,
      values: [items]
    })
  )
  .then(res => res.ok ? res.json : Promise.reject('Failed to append items to spreadsheet'))

module.formatRow = (row, spreadsheetId, token) =>
  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.parse({
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
    .then(res => res.ok ? res.json : Promise.reject('Failed to format row'))
