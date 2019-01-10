const admin = require('firebase-admin')
admin.initializeApp()

module.exports.default = admin.firestore()
