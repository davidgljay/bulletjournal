const db = require('../db')

module.exports = () => {
  const date = new Date()
  const weeklyUsers = db.collection('users').where('day', '==', date.getUTCDay()).where('hour', '==', date.getUTCHours())
  const dailyUsers = db.collection('users').where('day', '==', -1).where('hour', '==', date.getUTCHours())

  return Promise.all([weeklyUsers, dailyUsers])
    .then(([weeklyUsers, dailyUsers]) => {
      const batch = db.batch()
      if (!weeklyUsers.empty) {
        weeklyUsers.forEach(user => batch.set(db.collection('queue').doc(), users.data()))
      }
      if (!dailyUsers.empty) {
        dailyUsers.forEach(user => batch.set(db.collection('queue').doc(), users.data()))
      }
      return batch.commit()
    })

}
