const twilio = require('twilio')(accountSid, authToken);

const twilioSid = process.env.TWILIO_SID
const twilioKey = process.env.TWILIO_KEY
const twilioNumber = process.env.TWILIO_NUMBER

const twilioClient = twilio(twilioSid, twilioKey)
admin.initializeApp();

const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`

module.exports.default = (to, body) => twilioClient.messages
      .create({
         body,
         from: twilioNumber,
         to
       })
