require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
admin.firestore().settings({timestampsInSnapshots: true})

module.exports = admin.firestore()
