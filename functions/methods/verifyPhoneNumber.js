const sms = require('../twilio')

module.exports = (before, after, id) => {
  if (after.phoneConfirmed !== false) {
    return null
  }
  return sms(after.phone, 'Hello from TinyJournal! If you would like to enable sms journalling please respond "YES". You can type "STOP" at any time.')
}
