require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

module.exports = admin.firestore()
