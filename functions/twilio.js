const functions = require('firebase-functions')
const twilioClient = require('twilio')(functions.config().twilio.sid, functions.config().twilio.key)

const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${functions.config().twilio.sid}/Messages.json`

module.exports = (to, body) => twilioClient.messages
      .create({
         body,
         from: functions.config().twilio.number,
         to
       })
